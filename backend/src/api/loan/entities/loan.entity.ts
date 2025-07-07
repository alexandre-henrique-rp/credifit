import { ApiProperty } from '@nestjs/swagger';
import { LoanStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { EmployeeEntity } from 'src/api/employee/entities/employee.entity';

export class LoanEntity {
  @ApiProperty({
    description: 'ID único do empréstimo',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    description: 'ID do funcionário que solicitou o empréstimo',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  employeeId: number;

  @ApiProperty({
    description: 'Valor do empréstimo solicitado',
    example: 5000.0,
  })
  @IsNumber()
  @IsOptional()
  amount: number;

  @ApiProperty({
    description: 'Número de parcelas para o pagamento',
    example: 12,
  })
  @IsNumber()
  @IsOptional()
  installments: number;

  @ApiProperty({
    description: 'Status atual do empréstimo',
    enum: LoanStatus,
    example: 'PAID',
  })
  @IsOptional()
  status: LoanStatus;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-10T10:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-01-10T11:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty({
    description: 'Dados do funcionário associado',
    type: () => EmployeeEntity,
  })
  @Type(() => EmployeeEntity)
  employee?: EmployeeEntity;

  constructor(partial: Partial<LoanEntity>) {
    Object.assign(this, partial);
  }
}
