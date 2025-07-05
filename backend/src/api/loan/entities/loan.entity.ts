import { ApiProperty } from '@nestjs/swagger';
import { Loan, LoanStatus } from '@prisma/client';
import { EmployeeEntity } from 'src/api/employee/entities/employee.entity';

export class LoanEntity implements Loan {
  @ApiProperty({
    description: 'ID único do empréstimo',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do funcionário que solicitou o empréstimo',
    example: 1,
  })
  employeeId: number;

  @ApiProperty({
    description: 'Valor do empréstimo solicitado',
    example: 5000.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Número de parcelas para o pagamento',
    example: 12,
  })
  installments: number;

  @ApiProperty({
    description: 'Status atual do empréstimo',
    enum: LoanStatus,
    example: LoanStatus.APPROVED,
  })
  status: LoanStatus;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-10T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-01-10T11:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Dados do funcionário associado',
    type: () => EmployeeEntity,
  })
  employee?: EmployeeEntity;
}
