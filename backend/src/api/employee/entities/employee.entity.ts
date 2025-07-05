import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';

export class EmployeeEntity implements Omit<Employee, 'password'> {
  @ApiProperty({
    description: 'ID único do funcionário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome completo do funcionário',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'CPF do funcionário (somente números)',
    example: '12345678901',
  })
  cpf: string;

  @ApiProperty({
    description: 'E-mail do funcionário',
    example: 'joao.silva@empresa.com',
    required: false,
  })
  email: string | null;

  @ApiProperty({
    description: 'Salário do funcionário',
    example: 3500.5,
  })
  salary: number;

  @ApiProperty({
    description: 'ID da empresa à qual o funcionário pertence',
    example: 1,
  })
  companyId: number;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-01-02T18:00:00.000Z',
  })
  updatedAt: Date;
}
