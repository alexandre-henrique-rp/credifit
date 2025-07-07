import { Controller, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { ValidateAnalysisDto } from './dto/validate-analysis.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  create(@Body() validateAnalysisDto: ValidateAnalysisDto) {
    return this.analysisService.validateLoan(validateAnalysisDto);
  }

  // @Get()
  // findAll() {
  //   return this.analysisService.findAll();
  // }
}
