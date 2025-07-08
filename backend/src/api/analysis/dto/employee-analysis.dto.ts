import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class EmployeeAnalysisDto {
  @ApiProperty({
    description: 'ID do funcionário para análise de crédito',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  employeeId: number;

  @ApiProperty({
    description: 'Valor do empréstimo solicitado',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  loanAmount: number;
}