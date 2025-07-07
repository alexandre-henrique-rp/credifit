import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { LoanStatus } from '@prisma/client';

export class CreateLoanDto {
  @ApiProperty({
    description: 'O valor do empréstimo solicitado',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'O número de parcelas para o pagamento',
    example: 4,
    minimum: 1,
    maximum: 4,
  })
  @IsInt()
  @Min(1)
  @Max(4)
  @Type(() => Number)
  installments: number;

  @ApiProperty({
    description: 'O ID do funcionário que está solicitando o empréstimo',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  employeeId: number;

  @ApiProperty({
    description: 'O status do pagamento',
    enum: LoanStatus,
    example: LoanStatus.PENDING,
  })
  @IsEnum(LoanStatus)
  @IsOptional()
  status: LoanStatus;
}
