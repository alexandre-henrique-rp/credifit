import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { AuthGuard } from '../auth/auth.guard';
import { LoanStatus } from '@prisma/client';

@ApiTags('Pagamentos (Payment)')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process/:loanId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Processar pagamento de um empréstimo',
    description:
      'Envia empréstimo para processamento no gateway de pagamento externo',
  })
  @ApiParam({
    name: 'loanId',
    description: 'ID do empréstimo a ser processado',
  })
  @ApiOkResponse({
    description: 'Pagamento processado com sucesso',
    schema: {
      example: {
        loanId: 1,
        status: 'APPROVED',
        transactionId: 'TXN_1_1704723600000_ABC123',
        message: 'Pagamento aprovado com sucesso',
        processedAt: '2024-01-08T14:30:00.000Z',
        gatewayResponse: { status: 'aprovado' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Erro no processamento ou empréstimo já processado',
  })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  async processPayment(@Param('loanId', ParseIntPipe) loanId: number) {
    return this.paymentService.processLoanPayment(loanId);
  }

  @Get('status/:loanId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consultar status de pagamento',
    description: 'Retorna o status atual do processamento de pagamento',
  })
  @ApiParam({ name: 'loanId', description: 'ID do empréstimo' })
  @ApiOkResponse({
    description: 'Status do pagamento',
    schema: {
      example: {
        loanId: 1,
        status: 'APPROVED',
        lastUpdate: '2024-01-08T14:30:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  async getPaymentStatus(@Param('loanId', ParseIntPipe) loanId: number) {
    return this.paymentService.getPaymentStatus(loanId);
  }

  @Get('loans/by-status')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar empréstimos por status',
    description:
      'Retorna lista de empréstimos filtrados por status de pagamento',
  })
  @ApiQuery({
    name: 'status',
    description:
      'Status do pagamento (PENDING, PROCESSING, APPROVED, REJECTED, FAILED)',
    example: 'APPROVED',
  })
  @ApiOkResponse({
    description: 'Lista de empréstimos filtrada por status',
    schema: {
      example: [
        {
          id: 1,
          value: 1500,
          installments: 12,
          status: 'APPROVED',
          createdAt: '2024-01-08T14:00:00.000Z',
          employee: {
            name: 'João Silva',
            cpf: '123.***.***-01',
          },
        },
      ],
    },
  })
  async getLoansByStatus(@Query('status') status: string) {
    return this.paymentService.getLoansByStatus(status as LoanStatus);
  }

  @Post('retry/:loanId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reprocessar pagamento falhado',
    description:
      'Tenta reprocessar um empréstimo que falhou no gateway de pagamento',
  })
  @ApiParam({
    name: 'loanId',
    description: 'ID do empréstimo a ser reprocessado',
  })
  @ApiOkResponse({
    description: 'Reprocessamento iniciado',
    schema: {
      example: {
        loanId: 1,
        status: 'APPROVED',
        transactionId: 'TXN_1_1704723600000_DEF456',
        message: 'Pagamento aprovado com sucesso',
        processedAt: '2024-01-08T15:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Empréstimo não está em status FAILED',
  })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  async retryPayment(@Param('loanId', ParseIntPipe) loanId: number) {
    return this.paymentService.retryFailedPayment(loanId);
  }

  @Post('webhook')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Webhook para callbacks do gateway',
    description:
      'Endpoint para receber notificações do gateway de pagamento (futuro)',
  })
  @ApiOkResponse({ description: 'Webhook processado com sucesso' })
  handleWebhook(@Body() webhookData: any) {
    console.log(
      '🚀 ~ PaymentController ~ handleWebhook ~ webhookData:',
      webhookData,
    );
    // TODO: Implementar processamento de webhook
    return { message: 'Webhook received', timestamp: new Date() };
  }
}
