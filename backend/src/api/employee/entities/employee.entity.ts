import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EmployeeEntity implements Omit<Employee, 'password'> {
  @ApiProperty({
    description: 'ID único do funcionário',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Nome completo do funcionário',
    example: 'João da Silva',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'CPF do funcionário (somente números)',
    example: '12345678901',
  })
  @IsString()
  @IsOptional()
  cpf: string;

  @ApiProperty({
    description: 'E-mail do funcionário',
    example: 'joao.silva@empresa.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Salário do funcionário',
    example: 3500.5,
  })
  @IsNumber()
  @IsOptional()
  salary: number;

  @ApiProperty({
    description: 'ID da empresa à qual o funcionário pertence',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  companyId: number;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-01T12:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-01-02T18:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(partial: Partial<EmployeeEntity>) {
    Object.assign(this, partial);
  }
}
