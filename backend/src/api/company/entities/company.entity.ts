import { ApiProperty } from '@nestjs/swagger';
import { Company as CompanyModel } from '@prisma/client';
import { IsDate, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class Company implements Omit<CompanyModel, 'password'> {
  @ApiProperty({ description: 'ID da empresa', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Minha Empresa LTDA',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Minha Empresa e Serviços LTDA',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  razaoSocial: string;

  @ApiProperty({
    description: 'E-mail da empresa',
    example: 'contato@minhaempresa.com',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12345678000190' })
  @IsString()
  @IsOptional()
  cnpj: string;

  @ApiProperty({ 
    description: 'Indica se a empresa é conveniada/parceira da Credifit', 
    example: true,
    default: true 
  })
  @IsBoolean()
  @IsOptional()
  isPartner: boolean;

  @ApiProperty({ description: 'Data de criação do registro' })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(partial: Partial<Company>) {
    Object.assign(this, partial);
  }
}
