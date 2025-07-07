import { Injectable } from '@nestjs/common';
import { LoanService } from '../loan/loan.service';
import { ValidateAnalysisDto } from './dto/validate-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(private readonly loanService: LoanService) {}

  validateLoan(validateAnalysisDto: ValidateAnalysisDto) {
    const { amount } = validateAnalysisDto;

    if (amount <= 2000) {
      return { score: 400 };
    }
    if (amount > 2000 && amount <= 4000) {
      return { score: 500 };
    }
    if (amount > 4000 && amount <= 8000) {
      return { score: 600 };
    }
    if (amount > 8000 && amount <= 12000) {
      return { score: 700 };
    }
    return { score: 0 };
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
