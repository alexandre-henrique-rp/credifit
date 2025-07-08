import { Injectable, Logger } from '@nestjs/common';

export interface ScoreApiResponse {
  score: number;
}

@Injectable()
export class ExternalScoreService {
  private readonly logger = new Logger(ExternalScoreService.name);
  private readonly scoreApiUrl = 'https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf';

  /**
   * Busca score de crédito da API externa
   * @param cpf CPF do funcionário
   * @returns Score de crédito
   */
  async getEmployeeScore(cpf: string): Promise<number> {
    try {
      this.logger.log(`🔍 Consultando score para CPF: ${this.maskCpf(cpf)}`);
      
      const response = await fetch(this.scoreApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Timeout de 5 segundos
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Score API responded with status: ${response.status}`);
      }

      const data: ScoreApiResponse = await response.json();
      
      this.logger.log(`✅ Score obtido: ${data.score} para CPF: ${this.maskCpf(cpf)}`);
      
      return data.score;
    } catch (error) {
      this.logger.error(`❌ Erro ao consultar score para CPF ${this.maskCpf(cpf)}:`, error.message);
      
      // Fallback: retorna score padrão em caso de erro na API
      const fallbackScore = this.getFallbackScore();
      this.logger.warn(`🔄 Usando score fallback: ${fallbackScore}`);
      
      return fallbackScore;
    }
  }

  /**
   * Score fallback quando API externa está indisponível
   * Simula um score médio baseado no CPF
   */
  private getFallbackScore(): number {
    // Gera score entre 400-700 baseado em timestamp
    const now = Date.now();
    const scores = [400, 500, 600, 700];
    return scores[now % scores.length];
  }

  /**
   * Mascara CPF para logs (proteção de dados)
   */
  private maskCpf(cpf: string): string {
    if (cpf.length === 11) {
      return `${cpf.substring(0, 3)}.***.***-${cpf.substring(9)}`;
    }
    return '***.***.***-**';
  }
}