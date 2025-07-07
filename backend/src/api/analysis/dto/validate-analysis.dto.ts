import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ValidateAnalysisDto {
  @ApiProperty({
    description: 'O valor do empréstimo solicitado',
    example: 5000,
  })
  @IsNumber()
  amount: number;
}
