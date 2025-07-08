import { BadRequestException } from '@nestjs/common';

export class InsufficientScoreException extends BadRequestException {
  constructor(currentScore: number, requiredScore: number, salary: number) {
    super(
      `Score insuficiente para aprovação. Score atual: ${currentScore}, Score mínimo necessário: ${requiredScore} (salário: R$ ${salary.toFixed(2)})`,
    );
  }
}

export class ExceedsConsignableMarginException extends BadRequestException {
  constructor(requestedAmount: number, maxAmount: number, salary: number) {
    super(
      `Valor solicitado (R$ ${requestedAmount.toFixed(2)}) excede a margem consignável de 35% do salário. Valor máximo permitido: R$ ${maxAmount.toFixed(2)} (salário: R$ ${salary.toFixed(2)})`,
    );
  }
}

export class ScoreServiceUnavailableException extends BadRequestException {
  constructor() {
    super(
      'Serviço de análise de crédito temporariamente indisponível. Tente novamente em alguns minutos.',
    );
  }
}