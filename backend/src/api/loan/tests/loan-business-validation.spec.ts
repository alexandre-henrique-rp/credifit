import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from '../loan.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLoanDto } from '../dto/create-loan.dto';
import { AuthUser } from '../../auth/auth.types';
import {
  CompanyNotPartnerException,
  EmployeeNotAuthorized,
  EmployeeCompanyMismatchException,
} from '../exceptions/loan-business.exceptions';
import { NotFoundException } from '@nestjs/common';

describe('LoanService - Business Validation', () => {
  let service: LoanService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  const mockPrismaService = {
    employee: {
      findUnique: jest.fn(),
    },
    loan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create - Validation Tests', () => {
    const createLoanDto: CreateLoanDto = {
      employeeId: 1,
      amount: 5000,
      installments: 12,
      status: 'PENDING',
    };

    const authUserEmployee: AuthUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      userType: 'employee',
      companyId: 1,
    };

    const authUserCompany: AuthUser = {
      id: 1,
      name: 'Admin Company',
      email: 'admin@company.com',
      userType: 'company',
    };

    it('should throw NotFoundException when employee does not exist', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);

      await expect(
        service.create(createLoanDto, authUserEmployee),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw CompanyNotPartnerException when company is not partner', async () => {
      const mockEmployee = {
        id: 1,
        name: 'João Silva',
        companyId: 1,
        company: {
          id: 1,
          name: 'Non-Partner Company',
          isPartner: false,
        },
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);

      await expect(
        service.create(createLoanDto, authUserEmployee),
      ).rejects.toThrow(CompanyNotPartnerException);
    });

    it('should throw EmployeeNotAuthorized when employee tries to request loan for another employee', async () => {
      const mockEmployee = {
        id: 2, // Different from authUser.id
        name: 'Maria Silva',
        companyId: 1,
        company: {
          id: 1,
          name: 'Partner Company',
          isPartner: true,
        },
      };

      const createLoanForOther: CreateLoanDto = {
        ...createLoanDto,
        employeeId: 2,
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);

      await expect(
        service.create(createLoanForOther, authUserEmployee),
      ).rejects.toThrow(EmployeeNotAuthorized);
    });

    it('should throw EmployeeCompanyMismatchException when employee company does not match', async () => {
      const mockEmployee = {
        id: 1,
        name: 'João Silva',
        companyId: 2, // Different from authUser.companyId
        company: {
          id: 2,
          name: 'Another Company',
          isPartner: true,
        },
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);

      await expect(
        service.create(createLoanDto, authUserEmployee),
      ).rejects.toThrow(EmployeeCompanyMismatchException);
    });

    it('should successfully create loan for valid employee from partner company', async () => {
      const mockEmployee = {
        id: 1,
        name: 'João Silva',
        companyId: 1,
        company: {
          id: 1,
          name: 'Partner Company',
          isPartner: true,
        },
      };

      const mockCreatedLoan = {
        id: 1,
        employeeId: 1,
        value: 5000,
        installments: 12,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);
      mockPrismaService.loan.create.mockResolvedValue(mockCreatedLoan);

      const result = await service.create(createLoanDto, authUserEmployee);

      expect(result).toEqual(mockCreatedLoan);
      expect(mockPrismaService.loan.create).toHaveBeenCalledWith({
        data: {
          employeeId: 1,
          installments: 12,
          value: 5000,
        },
      });
    });

    it('should allow company users to create loans for any employee in partner companies', async () => {
      const mockEmployee = {
        id: 1,
        name: 'João Silva',
        companyId: 1,
        company: {
          id: 1,
          name: 'Partner Company',
          isPartner: true,
        },
      };

      const mockCreatedLoan = {
        id: 1,
        employeeId: 1,
        value: 5000,
        installments: 12,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployee);
      mockPrismaService.loan.create.mockResolvedValue(mockCreatedLoan);

      const result = await service.create(createLoanDto, authUserCompany);

      expect(result).toEqual(mockCreatedLoan);
      expect(mockPrismaService.loan.create).toHaveBeenCalledWith({
        data: {
          employeeId: 1,
          installments: 12,
          value: 5000,
        },
      });
    });
  });
});
