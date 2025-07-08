import { BadRequestException, ConflictException } from '@nestjs/common';

export class PaymentProcessingException extends BadRequestException {
  constructor(loanId: number, reason: string) {
    super(
      `Falha no processamento de pagamento para empréstimo ${loanId}: ${reason}`
    );
  }
}

export class LoanAlreadyProcessedException extends ConflictException {
  constructor(loanId: number, currentStatus: string) {
    super(
      `Empréstimo ${loanId} já foi processado. Status atual: ${currentStatus}. Apenas empréstimos com status PENDING podem ser processados.`
    );
  }
}

export class PaymentGatewayTimeoutException extends BadRequestException {
  constructor(loanId: number, attempts: number) {
    super(
      `Timeout no gateway de pagamento para empréstimo ${loanId} após ${attempts} tentativas. Tente novamente mais tarde.`
    );
  }
}

export class InvalidPaymentAmountException extends BadRequestException {
  constructor(loanId: number, amount: number) {
    super(
      `Valor inválido para processamento de pagamento do empréstimo ${loanId}: R$ ${amount.toFixed(2)}. Valor deve ser maior que zero.`
    );
  }
}