import { Injectable, Logger } from '@nestjs/common';
import { LoanService } from '../loan/loan.service';
import { ValidateAnalysisDto } from './dto/validate-analysis.dto';
import { EmployeeAnalysisDto } from './dto/employee-analysis.dto';
import { ExternalScoreService } from './services/external-score.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  InsufficientScoreException,
  ExceedsConsignableMarginException,
} from './exceptions/credit-analysis.exceptions';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    private readonly loanService: LoanService,
    private readonly externalScoreService: ExternalScoreService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Método legacy - mantido para compatibilidade
   * @deprecated Use analyzeEmployeeLoan instead
   */
  validateLoan(validateAnalysisDto: ValidateAnalysisDto) {
    const { amount } = validateAnalysisDto;
    this.logger.warn('⚠️ Using deprecated validateLoan method. Use analyzeEmployeeLoan instead.');

    // Lógica antiga mantida para não quebrar endpoints existentes
    if (amount <= 2000) return { score: 400 };
    if (amount > 2000 && amount <= 4000) return { score: 500 };
    if (amount > 4000 && amount <= 8000) return { score: 600 };
    if (amount > 8000 && amount <= 12000) return { score: 700 };
    return { score: 0 };
  }

  /**
   * Análise completa de crédito baseada no funcionário e salário
   * Implementa as regras corretas do desafio técnico
   */
  async analyzeEmployeeLoan(employeeAnalysisDto: EmployeeAnalysisDto) {
    const { employeeId, loanAmount } = employeeAnalysisDto;

    this.logger.log(`🔍 Iniciando análise de crédito - Funcionário: ${employeeId}, Valor: R$ ${loanAmount}`);

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
      throw new NotFoundException(`Funcionário com ID ${employeeId} não encontrado.`);
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
    const isApproved = employeeScore >= requiredScore;

    if (!isApproved) {
      throw new InsufficientScoreException(employeeScore, requiredScore, employee.salary);
    }

    // 6. Log de aprovação
    this.logger.log(`✅ Empréstimo aprovado - Funcionário: ${employee.name}, Score: ${employeeScore}/${requiredScore}, Valor: R$ ${loanAmount}`);

    return {
      approved: true,
      employeeId,
      employeeName: employee.name,
      salary: employee.salary,
      requestedAmount: loanAmount,
      maxConsignableAmount,
      availableMargin: maxConsignableAmount - loanAmount,
      employeeScore,
      requiredScore,
      company: employee.company.name,
      analysis: {
        marginCheck: 'PASSED',
        scoreCheck: 'PASSED',
        companyCheck: employee.company.isPartner ? 'PASSED' : 'FAILED',
      },
    };
  }

  /**
   * Determina o score mínimo baseado no salário do funcionário
   * Regras do desafio técnico:
   * - Até R$ 2.000,00 → score mínimo 400
   * - Até R$ 4.000,00 → score mínimo 500
   * - Até R$ 8.000,00 → score mínimo 600
   * - Até R$ 12.000,00 → score mínimo 700
   */
  private getMinimumScoreForSalary(salary: number): number {
    if (salary <= 2000) return 400;
    if (salary <= 4000) return 500;
    if (salary <= 8000) return 600;
    if (salary <= 12000) return 700;
    
    // Para salários acima de R$ 12.000, mantém score 700
    return 700;
  }

  async findPayment(id: number) {
    // timeout randomico entre 1 e 20 segundos
    const timeout = Math.floor(Math.random() * (20000 - 1000 + 1)) + 1000;

    // se time for menor que 10 segundos, alterar status para pago
    if (timeout < 10000) {
      await this.loanService.update(id, { status: 'PAID' });
      return { status: 'PAID' };
    }

    // se time for maior que 10 segundos, retornar para cliente como processando,
    //retornar para cliente sem interferir no processamento,
    if (timeout > 10000) {
      await this.loanService.update(id, { status: 'PENDING' });
      return { status: 'PENDING' };
    }
    // e aguardar o timeout para rejeitar em segundo plano
    setTimeout(() => {
      this.loanService.update(id, { status: 'PAID' }).catch((err) => {
        // Adiciona log para o caso de falha na atualização em segundo plano
        console.error(
          `[AnalysisService] Failed to auto-reject loan ${id} after timeout:`,
          err,
        );
      });
    }, timeout);

    return { status: 'PAID' };
  }
}
