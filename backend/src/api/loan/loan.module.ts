import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { CreditValidationService } from './services/credit-validation.service';
import { ExternalScoreService } from '../analysis/services/external-score.service';
import { AuthModule } from '../auth/auth.module';
import { EmployeeModule } from '../employee/employee.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [PrismaModule, AuthModule, EmployeeModule, CompanyModule],
  controllers: [LoanController],
  providers: [LoanService, CreditValidationService, ExternalScoreService],
  exports: [LoanService],
})
export class LoanModule {}
