import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Minha Empresa LTDA',
  })
  @IsString({ message: 'O nome da empresa deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da empresa não pode ser vazio' })
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'Razão social da empresa (opcional)',
    example: 'Minha Empresa e Serviços LTDA',
    required: false,
  })
  @IsString({ message: 'A razão social deve ser uma string' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  razaoSocial?: string;

  @ApiProperty({
    description: 'E-mail da empresa (opcional)',
    example: 'contato@minhaempresa.com',
    required: false,
  })
  @IsEmail({ message: 'O e-mail deve ser válido' })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value ? value.trim().toLowerCase() : value,
  )
  email?: string;

  @ApiProperty({
    description: 'Senha de acesso da empresa (opcional, mínimo 6 caracteres)',
    example: '123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(6, 20, { message: 'A senha deve ter entre 6 e 20 caracteres' })
  password?: string;

  @ApiProperty({
    description: 'CNPJ da empresa (somente números)',
    example: '12345678000190',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{14}$/, { message: 'O CNPJ deve conter apenas 14 números' })
  @Transform(({ value }: { value: string }) =>
    value ? value.replace(/\D/g, '').trim() : value,
  )
  cnpj: string;
}
