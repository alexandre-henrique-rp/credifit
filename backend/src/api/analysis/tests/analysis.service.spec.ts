import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from '../analysis.service';
import { ExternalScoreService } from '../services/external-score.service';
import { LoanService } from '../../loan/loan.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmployeeAnalysisDto } from '../dto/employee-analysis.dto';
import {
  InsufficientScoreException,
  ExceedsConsignableMarginException,
} from '../exceptions/credit-analysis.exceptions';
import { NotFoundException } from '@nestjs/common';

describe('AnalysisService - Score System', () => {
  let service: AnalysisService;
  let externalScoreService: ExternalScoreService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    employee: {
      findUnique: jest.fn(),
    },
  };

  const mockLoanService = {
    update: jest.fn(),
  };

  const mockExternalScoreService = {
    getEmployeeScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: LoanService,
          useValue: mockLoanService,
        },
        {
          provide: ExternalScoreService,
          useValue: mockExternalScoreService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    externalScoreService = module.get<ExternalScoreService>(ExternalScoreService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeEmployeeLoan', () => {
    const employeeAnalysisDto: EmployeeAnalysisDto = {
      employeeId: 1,
      loanAmount: 1500,
    };

    it('should throw NotFoundException when employee does not exist', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);

      await expect(service.analyzeEmployeeLoan(employeeAnalysisDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ExceedsConsignableMarginException when loan exceeds 35% of salary', async () => {
      const mockEmployee = {
        id: 1,
        name: 'João Silva',
        cpf: '12345678901',
        salary: 3000, // 35% = R$ 1.050
        company: {
          id: 1,
          name: 'Tech Corp',
          isPartner: true,
        },
      };

      const highLoanDto: EmployeeAnalysisDto = {
        employeeId: 1,
        loanAmount: 2000, // Acima de 35% de R$ 3.000
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);

      await expect(service.analyzeEmployeeLoan(highLoanDto)).rejects.toThrow(
        ExceedsConsignableMarginException,
      );
    });

    it('should throw InsufficientScoreException when employee score is below required', async () => {
      const mockEmployee = {
        id: 1,
        name: 'João Silva',
        cpf: '12345678901',
        salary: 5000, // Score mínimo necessário: 500
        company: {
          id: 1,
          name: 'Tech Corp',
          isPartner: true,
        },
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);
      mockExternalScoreService.getEmployeeScore.mockResolvedValue(350); // Score insuficiente

      await expect(service.analyzeEmployeeLoan(employeeAnalysisDto)).rejects.toThrow(
        InsufficientScoreException,
      );
    });

    it('should approve loan for employee with sufficient score and within margin', async () => {
      const mockEmployee = {
        id: 1,
        name: 'João Silva',
        cpf: '12345678901',
        salary: 5000, // 35% = R$ 1.750, Score mínimo: 500
        company: {
          id: 1,
          name: 'Tech Corp',
          isPartner: true,
        },
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);
      mockExternalScoreService.getEmployeeScore.mockResolvedValue(650); // Score suficiente

      const result = await service.analyzeEmployeeLoan(employeeAnalysisDto);

      expect(result).toEqual({
        approved: true,
        employeeId: 1,
        employeeName: 'João Silva',
        salary: 5000,
        requestedAmount: 1500,
        maxConsignableAmount: 1750,
        availableMargin: 250,
        employeeScore: 650,
        requiredScore: 500,
        company: 'Tech Corp',
        analysis: {
          marginCheck: 'PASSED',
          scoreCheck: 'PASSED',
          companyCheck: 'PASSED',
        },
      });
    });

    it('should calculate correct minimum score for different salary ranges', async () => {
      const testCases = [
        { salary: 1500, expectedScore: 400 },
        { salary: 3000, expectedScore: 500 },
        { salary: 6000, expectedScore: 600 },
        { salary: 10000, expectedScore: 700 },
        { salary: 15000, expectedScore: 700 }, // Acima de 12k mantém 700
      ];

      for (const testCase of testCases) {
        const mockEmployee = {
          id: 1,
          name: 'Test Employee',
          cpf: '12345678901',
          salary: testCase.salary,
          company: {
            id: 1,
            name: 'Test Corp',
            isPartner: true,
          },
        };

        mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);
        mockExternalScoreService.getEmployeeScore.mockResolvedValue(testCase.expectedScore);

        const result = await service.analyzeEmployeeLoan({
          employeeId: 1,
          loanAmount: 100, // Valor baixo para não exceder margem
        });

        expect(result.requiredScore).toBe(testCase.expectedScore);
      }
    });
  });

  describe('validateLoan (legacy method)', () => {
    it('should return score based on amount (legacy behavior)', () => {
      const testCases = [
        { amount: 1000, expectedScore: 400 },
        { amount: 3000, expectedScore: 500 },
        { amount: 6000, expectedScore: 600 },
        { amount: 10000, expectedScore: 700 },
        { amount: 15000, expectedScore: 0 },
      ];

      testCases.forEach(({ amount, expectedScore }) => {
        const result = service.validateLoan({ amount });
        expect(result.score).toBe(expectedScore);
      });
    });
  });
});