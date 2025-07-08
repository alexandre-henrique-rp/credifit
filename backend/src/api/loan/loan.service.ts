import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthUser } from '../auth/auth.types';
import { CreditValidationService } from './services/credit-validation.service';
import {
  CompanyNotPartnerException,
  EmployeeNotAuthorized,
  EmployeeCompanyMismatchException,
} from './exceptions/loan-business.exceptions';

@Injectable()
export class LoanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly creditValidationService: CreditValidationService,
  ) {}

  async create(createLoanDto: CreateLoanDto, authUser: AuthUser) {
    const { employeeId, amount, installments } = createLoanDto;

    // 1. Validar elegibilidade do funcionário (empresa conveniada, autorização)
    const employee = await this.validateEmployeeEligibility(employeeId, authUser);

    // 2. Validar análise de crédito (score + margem consignável)
    await this.creditValidationService.validateLoanCreation(employeeId, amount);

    // 3. Log de auditoria
    console.log(`✅ Loan approved for employee ${employee.name} from partner company ${employee.company.name} - Amount: R$ ${amount}`);

    // 4. Criar empréstimo com status PENDING (aguardando processamento de pagamento)
    const loan = await this.prisma.loan.create({
      data: {
        employeeId,
        installments,
        value: amount,
        status: 'PENDING', // Será processado pelo gateway de pagamento
      },
    });

    // 5. Log de empréstimo criado com sucesso
    console.log(`📄 Empréstimo criado com sucesso! ID: ${loan.id} - Valor: R$ ${amount} - Status: PENDING`);
    console.log(`ℹ️  Para processar o pagamento, use: POST /payment/process/${loan.id}`);

    return loan;
  }

  /**
   * Valida se um funcionário pode solicitar empréstimo
   * @param employeeId ID do funcionário
   * @param authUser Usuário autenticado
   * @returns Dados do funcionário e empresa se válido
   */
  private async validateEmployeeEligibility(employeeId: number, authUser: AuthUser) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        company: {
          select: { id: true, name: true, isPartner: true },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(
        `Funcionário com ID ${employeeId} não encontrado.`,
      );
    }

    // Empresas devem ser conveniadas
    if (!employee.company.isPartner) {
      throw new CompanyNotPartnerException(employee.company.name);
    }

    // Funcionários só podem solicitar para si mesmos
    if (authUser.userType === 'employee') {
      if (authUser.id !== employeeId) {
        throw new EmployeeNotAuthorized();
      }
      
      // Verificar consistência da empresa
      if (authUser.companyId !== employee.companyId) {
        throw new EmployeeCompanyMismatchException();
      }
    }

    return employee;
  }

  /**
   * Consulta informações de margem consignável do funcionário
   */
  async getConsignableInfo(employeeId: number) {
    return this.creditValidationService.getConsignableInfo(employeeId);
  }

  findAll() {
    return this.prisma.loan.findMany({ include: { employee: true } });
  }

  async findOne(id: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado.`);
    }

    return loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    await this.findOne(id); // Garante que o empréstimo existe
    return this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Garante que o empréstimo existe
    await this.prisma.loan.delete({ where: { id } });
    return { message: `Empréstimo com ID ${id} removido com sucesso.` };
  }
}
