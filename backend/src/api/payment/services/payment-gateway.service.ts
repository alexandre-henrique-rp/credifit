import { Injectable, Logger } from '@nestjs/common';

export interface PaymentRequest {
  employeeId: number;
  employeeName: string;
  cpf: string;
  amount: number;
  installments: number;
  loanId: number;
}

export interface PaymentResponse {
  status: string;
  transactionId?: string;
  message?: string;
  timestamp?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  gatewayResponse: PaymentResponse;
  processedAt: Date;
}

@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);
  private readonly gatewayUrl = 'https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 segundo

  /**
   * Processa pagamento no gateway externo
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    const { employeeId, employeeName, cpf, amount, loanId } = paymentRequest;
    
    this.logger.log(`🔄 Iniciando processamento de pagamento para empréstimo ${loanId} - Funcionário: ${employeeName} (ID: ${employeeId}) - Valor: R$ ${amount.toFixed(2)}`);

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.log(`📡 Tentativa ${attempt}/${this.maxRetries} - Enviando para gateway de pagamento`);
        
        const response = await this.sendToGateway(paymentRequest);
        const result = this.processGatewayResponse(response, loanId);
        
        if (result.success) {
          this.logger.log(`✅ Pagamento aprovado com sucesso! Transação: ${result.transactionId} - Empréstimo: ${loanId}`);
          return result;
        } else {
          this.logger.warn(`❌ Pagamento rejeitado pelo gateway - Empréstimo: ${loanId} - Status: ${response.status}`);
          // Para rejeições do gateway, não retentamos
          return result;
        }
        
      } catch (error) {
        lastError = error;
        this.logger.warn(`⚠️ Erro na tentativa ${attempt}/${this.maxRetries} para empréstimo ${loanId}:`, error.message);
        
        if (attempt < this.maxRetries) {
          this.logger.log(`⏳ Aguardando ${this.retryDelay}ms antes da próxima tentativa...`);
          await this.delay(this.retryDelay);
        }
      }
    }

    // Todas as tentativas falharam
    this.logger.error(`🚫 Falha definitiva no processamento de pagamento após ${this.maxRetries} tentativas - Empréstimo: ${loanId}`, lastError?.message);
    
    throw new Error(`Falha no processamento de pagamento após ${this.maxRetries} tentativas: ${lastError?.message || 'Erro desconhecido'}`);
  }

  /**
   * Envia requisição para o gateway de pagamento
   */
  private async sendToGateway(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const requestBody = {
      employee_id: paymentRequest.employeeId,
      employee_name: paymentRequest.employeeName,
      cpf: this.maskCpf(paymentRequest.cpf),
      amount: paymentRequest.amount,
      installments: paymentRequest.installments,
      loan_id: paymentRequest.loanId,
      timestamp: new Date().toISOString(),
    };

    this.logger.debug(`📤 Enviando dados para gateway:`, { 
      ...requestBody, 
      cpf: this.maskCpf(paymentRequest.cpf) 
    });

    const response = await fetch(this.gatewayUrl, {
      method: 'GET', // Mock API usa GET
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Credifit-Backend/1.0',
      },
      signal: AbortSignal.timeout(10000), // Timeout 10s
    });

    if (!response.ok) {
      throw new Error(`Gateway retornou status ${response.status}: ${response.statusText}`);
    }

    const data: PaymentResponse = await response.json();
    
    this.logger.debug(`📥 Resposta do gateway:`, data);
    
    return data;
  }

  /**
   * Processa resposta do gateway e gera resultado
   */
  private processGatewayResponse(gatewayResponse: PaymentResponse, loanId: number): PaymentResult {
    const transactionId = this.generateTransactionId(loanId);
    const success = gatewayResponse.status === 'aprovado';
    
    return {
      success,
      transactionId,
      gatewayResponse,
      processedAt: new Date(),
    };
  }

  /**
   * Gera ID único para a transação
   */
  private generateTransactionId(loanId: number): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN_${loanId}_${timestamp}_${random}`.toUpperCase();
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

  /**
   * Delay para retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simula processamento de webhook (para futuras implementações)
   */
  async processWebhook(webhookData: any): Promise<void> {
    this.logger.log(`🔔 Webhook recebido:`, webhookData);
    
    // TODO: Implementar processamento de callback do gateway
    // - Validar assinatura do webhook
    // - Atualizar status do empréstimo
    // - Enviar notificações
  }
}