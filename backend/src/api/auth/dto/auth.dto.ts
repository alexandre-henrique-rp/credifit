import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'contato@minhaempresa.com',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  password: string;

  @ApiProperty({
    description: 'Tipo do usuário',
    example: 'employee',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  userType: string;
}
