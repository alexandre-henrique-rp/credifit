import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { PaymentGatewayService } from '../services/payment-gateway.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { 
  PaymentProcessingException,
  LoanAlreadyProcessedException 
} from '../exceptions/payment.exceptions';

describe('PaymentService', () => {
  let service: PaymentService;
  let gatewayService: PaymentGatewayService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    loan: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockGatewayService = {
    processPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentGatewayService,
          useValue: mockGatewayService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    gatewayService = module.get<PaymentGatewayService>(PaymentGatewayService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processLoanPayment', () => {
    const mockLoan = {
      id: 1,
      value: 1500,
      installments: 12,
      status: 'PENDING',
      employee: {
        id: 1,
        name: 'João Silva',
        cpf: '12345678901',
        salary: 5000,
      },
    };

    it('should throw NotFoundException when loan does not exist', async () => {
      mockPrismaService.loan.findUnique.mockResolvedValue(null);

      await expect(service.processLoanPayment(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw LoanAlreadyProcessedException when loan is not PENDING', async () => {
      const processedLoan = { ...mockLoan, status: 'APPROVED' };
      mockPrismaService.loan.findUnique.mockResolvedValue(processedLoan);

      await expect(service.processLoanPayment(1)).rejects.toThrow(
        LoanAlreadyProcessedException,
      );
    });

    it('should successfully process payment when gateway approves', async () => {
      const mockGatewayResult = {
        success: true,
        transactionId: 'TXN_1_123456789_ABC123',
        gatewayResponse: { status: 'aprovado' },
        processedAt: new Date(),
      };

      mockPrismaService.loan.findUnique.mockResolvedValue(mockLoan);
      mockPrismaService.loan.update.mockResolvedValue({ ...mockLoan, status: 'PROCESSING' });
      mockGatewayService.processPayment.mockResolvedValue(mockGatewayResult);

      const result = await service.processLoanPayment(1);

      expect(result).toEqual({
        loanId: 1,
        status: 'APPROVED',
        transactionId: 'TXN_1_123456789_ABC123',
        message: 'Pagamento aprovado com sucesso',
        processedAt: mockGatewayResult.processedAt,
        gatewayResponse: { status: 'aprovado' },
      });

      expect(mockPrismaService.loan.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'PROCESSING', updatedAt: expect.any(Date) },
      });
    });

    it('should handle gateway rejection', async () => {
      const mockGatewayResult = {
        success: false,
        transactionId: 'TXN_1_123456789_DEF456',
        gatewayResponse: { status: 'rejeitado' },
        processedAt: new Date(),
      };

      mockPrismaService.loan.findUnique.mockResolvedValue(mockLoan);
      mockPrismaService.loan.update.mockResolvedValue({ ...mockLoan, status: 'PROCESSING' });
      mockGatewayService.processPayment.mockResolvedValue(mockGatewayResult);

      const result = await service.processLoanPayment(1);

      expect(result.status).toBe('REJECTED');
      expect(result.message).toBe('Pagamento rejeitado pelo gateway');
    });

    it('should handle gateway errors and mark loan as FAILED', async () => {
      mockPrismaService.loan.findUnique.mockResolvedValue(mockLoan);
      mockPrismaService.loan.update.mockResolvedValue({ ...mockLoan, status: 'PROCESSING' });
      mockGatewayService.processPayment.mockRejectedValue(new Error('Gateway timeout'));

      await expect(service.processLoanPayment(1)).rejects.toThrow(
        PaymentProcessingException,
      );

      // Deve marcar como FAILED em caso de erro
      expect(mockPrismaService.loan.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'FAILED', updatedAt: expect.any(Date) },
      });
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status for existing loan', async () => {
      const mockLoan = {
        id: 1,
        status: 'APPROVED',
        updatedAt: new Date('2024-01-08T14:30:00.000Z'),
      };

      mockPrismaService.loan.findUnique.mockResolvedValue(mockLoan);

      const result = await service.getPaymentStatus(1);

      expect(result).toEqual({
        loanId: 1,
        status: 'APPROVED',
        lastUpdate: mockLoan.updatedAt,
      });
    });

    it('should throw NotFoundException for non-existent loan', async () => {
      mockPrismaService.loan.findUnique.mockResolvedValue(null);

      await expect(service.getPaymentStatus(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('retryFailedPayment', () => {
    const failedLoan = {
      id: 1,
      value: 1500,
      installments: 12,
      status: 'FAILED',
      employee: {
        id: 1,
        name: 'João Silva',
        cpf: '12345678901',
        salary: 5000,
      },
    };

    it('should successfully retry failed payment', async () => {
      const mockGatewayResult = {
        success: true,
        transactionId: 'TXN_1_123456789_RETRY1',
        gatewayResponse: { status: 'aprovado' },
        processedAt: new Date(),
      };

      // First call should return FAILED loan, second call should return PENDING loan
      mockPrismaService.loan.findUnique
        .mockResolvedValueOnce(failedLoan)
        .mockResolvedValueOnce({ ...failedLoan, status: 'PENDING' });
      
      mockPrismaService.loan.update.mockResolvedValue({ ...failedLoan, status: 'PENDING' });
      mockGatewayService.processPayment.mockResolvedValue(mockGatewayResult);

      const result = await service.retryFailedPayment(1);

      expect(result.status).toBe('APPROVED');
      expect(result.transactionId).toBe('TXN_1_123456789_RETRY1');
    });

    it('should throw error when trying to retry non-failed loan', async () => {
      const approvedLoan = { ...failedLoan, status: 'APPROVED' };
      mockPrismaService.loan.findUnique.mockResolvedValue(approvedLoan);

      await expect(service.retryFailedPayment(1)).rejects.toThrow(
        PaymentProcessingException,
      );
    });
  });

  describe('getLoansByStatus', () => {
    it('should return loans filtered by status', async () => {
      const mockLoans = [
        {
          id: 1,
          value: 1500,
          status: 'APPROVED',
          createdAt: new Date(),
          employee: { name: 'João Silva', cpf: '123.***.***-01' },
        },
      ];

      mockPrismaService.loan.findMany.mockResolvedValue(mockLoans);

      const result = await service.getLoansByStatus('APPROVED');

      expect(result).toEqual(mockLoans);
      expect(mockPrismaService.loan.findMany).toHaveBeenCalledWith({
        where: { status: 'APPROVED' },
        include: {
          employee: {
            select: { name: true, cpf: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});