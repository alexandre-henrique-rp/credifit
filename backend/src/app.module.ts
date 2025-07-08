import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './api/company/company.module';
import { EmployeeModule } from './api/employee/employee.module';
import { LoanModule } from './api/loan/loan.module';
import { AnalysisModule } from './api/analysis/analysis.module';
import { AuthModule } from './api/auth/auth.module';
import { PaymentModule } from './api/payment/payment.module';

@Module({
  imports: [
    PrismaModule,
    CompanyModule,
    EmployeeModule,
    LoanModule,
    AnalysisModule,
    AuthModule,
    PaymentModule,
  ],
})
export class AppModule {}
