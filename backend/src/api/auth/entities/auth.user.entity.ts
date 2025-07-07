import { Type } from 'class-transformer';
import { AuthUserEntity } from './auth.entity';
import { IsString } from 'class-validator';

export class AuthResponseEntity {
  @Type(() => AuthUserEntity)
  user: AuthUserEntity;

  @IsString()
  token: string;
}
