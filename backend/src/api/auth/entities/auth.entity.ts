import { IsNumber, IsString } from 'class-validator';

export class AuthUserEntity {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  userType: string;
}
