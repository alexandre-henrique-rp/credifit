import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse } from './auth.types';
import { NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async SignIn(
    @Body() authDto: AuthDto,
  ): Promise<AuthResponse | NotFoundException | UnauthorizedException> {
    return await this.authService.signIn(authDto);
  }
}
