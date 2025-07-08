import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaymentGatewayService,
  PaymentRequest,
  PaymentResult,
} from './services/payment-gateway.service';
import {
  PaymentProcessingException,
  LoanAlreadyProcessedException,
} from './exceptions/payment.exceptions';
import { Loan, LoanStatus } from '@prisma/client';

export interface PaymentProcessResult {
  loanId: number;
  status: LoanStatus;
  transactionId?: string;
  message: string;
  processedAt: Date;
  gatewayResponse?: any;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentGateway: PaymentGatewayService,
  ) {}

  /**
   * Processa pagamento de um empréstimo
   */
  async processLoanPayment(loanId: number): Promise<PaymentProcessResult> {
    this.logger.log(
      `🎯 Iniciando processamento de pagamento para empréstimo ${loanId}`,
    );

    // 1. Buscar dados do empréstimo
    const loan = await this.getLoanWithEmployee(loanId);

    // 2. Validar se pode ser processado
    this.validateLoanForPayment(loan);

    // 3. Atualizar status para PROCESSING
    await this.updateLoanStatus(loanId, LoanStatus.PROCESSING);

    try {
      // 4. Preparar dados para o gateway
      const paymentRequest: PaymentRequest = {
        employeeId: loan.employee.id,
        employeeName: loan.employee.name,
        cpf: loan.employee.cpf,
        amount: loan.value,
        installments: loan.installments,
        loanId: loan.id,
      };

      // 5. Processar no gateway
      const gatewayResult =
        await this.paymentGateway.processPayment(paymentRequest);

      // 6. Atualizar empréstimo baseado no resultado
      const finalStatus = gatewayResult.success ? 'APPROVED' : 'REJECTED';
      await this.updateLoanWithPaymentResult(
        loanId,
        gatewayResult,
        finalStatus,
      );

      this.logger.log(
        `✅ Processamento concluído para empréstimo ${loanId} - Status: ${finalStatus}`,
      );

      return {
        loanId,
        status: finalStatus,
        transactionId: gatewayResult.transactionId,
        message: gatewayResult.success
          ? 'Pagamento aprovado com sucesso'
          : 'Pagamento rejeitado pelo gateway',
        processedAt: gatewayResult.processedAt,
        gatewayResponse: gatewayResult.gatewayResponse,
      };
    } catch (error) {
      // 7. Em caso de erro, marcar como FAILED
      await this.updateLoanStatus(loanId, 'FAILED');

      const errorMessage =
        error instanceof Error
          ? error.message
          : String(error || 'Erro desconhecido');

      this.logger.error(
        `❌ Erro no processamento de pagamento para empréstimo ${loanId}: ${errorMessage}`,
      );

      throw new PaymentProcessingException(loanId, errorMessage);
    }
  }

  /**
   * Busca empréstimo com dados do funcionário
   */
  private async getLoanWithEmployee(loanId: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            cpf: true,
            salary: true,
          },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException(
        `Empréstimo com ID ${loanId} não encontrado.`,
      );
    }

    return loan;
  }

  /**
   * Valida se empréstimo pode ser processado
   */
  private validateLoanForPayment(loan: Loan): void {
    const allowedStatuses: LoanStatus[] = [LoanStatus.PENDING];

    if (!allowedStatuses.includes(loan.status)) {
      throw new LoanAlreadyProcessedException(loan.id, loan.status);
    }
  }

  /**
   * Atualiza status do empréstimo
   */
  private async updateLoanStatus(
    loanId: number,
    status: LoanStatus,
  ): Promise<void> {
    await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    this.logger.log(
      `📝 Empréstimo ${loanId} atualizado para status: ${status}`,
    );
  }

  /**
   * Atualiza empréstimo com resultado do pagamento
   */
  private async updateLoanWithPaymentResult(
    loanId: number,
    paymentResult: PaymentResult,
    status: LoanStatus,
  ): Promise<void> {
    await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        status,
        updatedAt: new Date(),
        // TODO: Adicionar campos para armazenar dados de pagamento
        // transactionId: paymentResult.transactionId,
        // gatewayResponse: JSON.stringify(paymentResult.gatewayResponse),
      },
    });
  }

  /**
   * Consulta status de pagamento
   */
  async getPaymentStatus(
    loanId: number,
  ): Promise<{ loanId: number; status: string; lastUpdate: Date }> {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      select: { id: true, status: true, updatedAt: true },
    });

    if (!loan) {
      throw new NotFoundException(
        `Empréstimo com ID ${loanId} não encontrado.`,
      );
    }

    return {
      loanId: loan.id,
      status: loan.status,
      lastUpdate: loan.updatedAt,
    };
  }

  /**
   * Lista empréstimos por status
   */
  async getLoansByStatus(status: LoanStatus) {
    return this.prisma.loan.findMany({
      where: { status },
      include: {
        employee: {
          select: { name: true, cpf: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Reprocessa empréstimo que falhou
   */
  async retryFailedPayment(loanId: number): Promise<PaymentProcessResult> {
    this.logger.log(`🔄 Tentando reprocessar empréstimo ${loanId}`);

    const loan = await this.getLoanWithEmployee(loanId);

    if (loan.status !== LoanStatus.FAILED) {
      throw new PaymentProcessingException(
        loanId,
        `Empréstimo não está em status FAILED. Status atual: ${loan.status}`,
      );
    }

    // Reset para PENDING e processa novamente
    await this.updateLoanStatus(loanId, LoanStatus.PENDING);
    return this.processLoanPayment(loanId);
  }
}
