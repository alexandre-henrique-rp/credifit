import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Nome do funcionário', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  name: string;

  @ApiProperty({
    description: 'CPF do funcionário (somente números)',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{11}$/, { message: 'O CPF deve conter apenas 11 números' })
  @Transform(({ value }: { value: string }) =>
    value ? value.replace(/\D/g, '').trim() : value,
  )
  cpf: string;

  @ApiProperty({
    description: 'E-mail do funcionário (opcional)',
    example: 'joao.silva@email.com',
    required: false,
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) =>
    value ? value.trim().toLowerCase() : value,
  )
  email: string;

  @ApiProperty({
    description:
      'Senha de acesso do funcionário (opcional, mínimo 6 caracteres)',
    example: 'senha123',
    required: false,
  })
  @IsString()
  @Length(6, 20, { message: 'A senha deve ter entre 6 e 20 caracteres' })
  password: string;

  @ApiProperty({ description: 'Salário do funcionário', example: 3500.5 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  salary: number;

  @ApiProperty({
    description: 'CNPJ da empresa em que o funcionário trabalha',
    example: '12345678901234',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{14}$/, { message: 'O CNPJ deve conter apenas 14 números' })
  @Transform(({ value }: { value: string }) =>
    value ? value.replace(/\D/g, '').trim() : value,
  )
  @Type(() => String)
  companyCnpj: string;
}
