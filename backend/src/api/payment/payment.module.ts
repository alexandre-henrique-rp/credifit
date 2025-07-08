import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentGatewayService } from './services/payment-gateway.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentGatewayService],
  exports: [PaymentService],
})
export class PaymentModule {}