import { ApiProperty } from '@nestjs/swagger';
import { Company as CompanyModel } from '@prisma/client';

export class Company implements Omit<CompanyModel, 'password'> {
  @ApiProperty({ description: 'ID da empresa', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Minha Empresa LTDA',
  })
  name: string;

  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Minha Empresa e Serviços LTDA',
    required: false,
    nullable: true,
  })
  razaoSocial: string | null;

  @ApiProperty({
    description: 'E-mail da empresa',
    example: 'contato@minhaempresa.com',
    required: false,
    nullable: true,
  })
  email: string | null;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12345678000190' })
  cnpj: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;
}
