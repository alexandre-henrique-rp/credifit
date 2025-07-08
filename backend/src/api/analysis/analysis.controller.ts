import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { ValidateAnalysisDto } from './dto/validate-analysis.dto';
import { EmployeeAnalysisDto } from './dto/employee-analysis.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Análise de Crédito')
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Validação de empréstimo (método legacy)',
    description: 'DEPRECATED: Use /analysis/employee para análise completa baseada em funcionário'
  })
  @ApiOkResponse({ description: 'Score calculado com base no valor' })
  create(@Body() validateAnalysisDto: ValidateAnalysisDto) {
    return this.analysisService.validateLoan(validateAnalysisDto);
  }

  @Post('employee')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Análise completa de crédito do funcionário',
    description: 'Realiza análise completa considerando salário, score e margem consignável'
  })
  @ApiOkResponse({ 
    description: 'Análise de crédito aprovada',
    schema: {
      example: {
        approved: true,
        employeeId: 1,
        employeeName: 'João Silva',
        salary: 5000,
        requestedAmount: 1500,
        maxConsignableAmount: 1750,
        availableMargin: 250,
        employeeScore: 650,
        requiredScore: 500,
        company: 'Tech Corp',
        analysis: {
          marginCheck: 'PASSED',
          scoreCheck: 'PASSED',
          companyCheck: 'PASSED'
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Score insuficiente ou margem excedida' })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  analyzeEmployee(@Body() employeeAnalysisDto: EmployeeAnalysisDto) {
    return this.analysisService.analyzeEmployeeLoan(employeeAnalysisDto);
  }
}
