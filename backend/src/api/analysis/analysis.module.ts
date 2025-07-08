import { Module } from '@nestjs/common';
import { LoanModule } from '../loan/loan.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { ExternalScoreService } from './services/external-score.service';

@Module({
  imports: [LoanModule, PrismaModule],
  controllers: [AnalysisController],
  providers: [AnalysisService, ExternalScoreService],
  exports: [AnalysisService], // Exporta para uso em outros módulos
})
export class AnalysisModule {}
