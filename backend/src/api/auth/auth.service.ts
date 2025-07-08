import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthResponse } from './auth.types';

interface User {
  email: string;
  password: string;
  name: string;
  id: number;
  companyId?: number; // Apenas para funcionários
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    authDto: AuthDto,
  ): Promise<AuthResponse | NotFoundException | UnauthorizedException> {
    const { email, password, userType } = authDto;

    let user: User | null;
    if (userType === 'employee') {
      user = await this.getEmployee(email);
    } else {
      user = await this.getCompany(email);
    }
    if (!user) {
      return new NotFoundException(`Email ou senha inválidos.`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new UnauthorizedException('Email ou senha inválidos.');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: userType || 'employee',
      ...(userType === 'employee' && user.companyId && { companyId: user.companyId }),
    };

    const token = this.jwtService.sign(payload);

    return { user: payload, token };
  }

  async getCompany(email: string) {
    const company = await this.prisma.company.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
    return company ?? null;
  }

  async getEmployee(email: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, companyId: true },
    });
    return employee ?? null;
  }
}
