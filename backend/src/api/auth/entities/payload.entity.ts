import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class PayloadEntity {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsString()
  @Type(() => String)
  name: string;

  @IsString()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  userType: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  cpf?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  razaoSocial?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  cnpj?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  companyId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  salary?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updatedAt?: Date;
}
