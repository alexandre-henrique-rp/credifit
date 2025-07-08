import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ExternalScoreService } from '../../analysis/services/external-score.service';
import {
  InsufficientScoreException,
  ExceedsConsignableMarginException,
} from '../../analysis/exceptions/credit-analysis.exceptions';

@Injectable()
export class CreditValidationService {
  private readonly logger = new Logger(CreditValidationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly externalScoreService: ExternalScoreService,
  ) {}

  /**
   * Valida crédito para criação de empréstimo
   * Integra as regras de score e margem consignável
   */
  async validateLoanCreation(employeeId: number, loanAmount: number): Promise<void> {
    this.logger.log(`🔍 Validando crédito - Funcionário: ${employeeId}, Valor: R$ ${loanAmount}`);

    // 1. Buscar dados do funcionário
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        company: {
          select: { id: true, name: true, isPartner: true },
        },
      },
    });

    if (!employee) {
      throw new Error(`Funcionário com ID ${employeeId} não encontrado.`);
    }

    // 2. Validar margem consignável (35% do salário)
    const maxConsignableAmount = employee.salary * 0.35;
    if (loanAmount > maxConsignableAmount) {
      throw new ExceedsConsignableMarginException(loanAmount, maxConsignableAmount, employee.salary);
    }

    // 3. Buscar score do funcionário na API externa
    const employeeScore = await this.externalScoreService.getEmployeeScore(employee.cpf);

    // 4. Determinar score mínimo baseado no salário
    const requiredScore = this.getMinimumScoreForSalary(employee.salary);

    // 5. Validar se score é suficiente
    if (employeeScore < requiredScore) {
      throw new InsufficientScoreException(employeeScore, requiredScore, employee.salary);
    }

    // 6. Log de aprovação
    this.logger.log(`✅ Crédito aprovado - Funcionário: ${employee.name}, Score: ${employeeScore}/${requiredScore}, Margem: R$ ${loanAmount}/${maxConsignableAmount.toFixed(2)}`);
  }

  /**
   * Determina o score mínimo baseado no salário do funcionário
   * Regras do desafio técnico
   */
  private getMinimumScoreForSalary(salary: number): number {
    if (salary <= 2000) return 400;
    if (salary <= 4000) return 500;
    if (salary <= 8000) return 600;
    if (salary <= 12000) return 700;
    return 700; // Para salários acima de R$ 12.000
  }

  /**
   * Calcula informações de margem consignável
   */
  async getConsignableInfo(employeeId: number): Promise<{
    salary: number;
    maxConsignableAmount: number;
    currentLoansAmount: number;
    availableAmount: number;
  }> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        Loan: {
          where: {
            status: { in: ['PENDING', 'PROCESSING'] }, // Empréstimos ativos
          },
        },
      },
    });

    if (!employee) {
      throw new Error(`Funcionário com ID ${employeeId} não encontrado.`);
    }

    const maxConsignableAmount = employee.salary * 0.35;
    const currentLoansAmount = employee.Loan.reduce((total, loan) => total + loan.value, 0);
    const availableAmount = maxConsignableAmount - currentLoansAmount;

    return {
      salary: employee.salary,
      maxConsignableAmount,
      currentLoansAmount,
      availableAmount: Math.max(0, availableAmount),
    };
  }
}