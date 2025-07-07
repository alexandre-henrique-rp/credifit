import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    const { employeeId, amount, installments } = createLoanDto;

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        `Funcionário com ID ${employeeId} não encontrado.`,
      );
    }

    return this.prisma.loan.create({
      data: {
        employeeId,
        installments,
        value: amount,
      },
    });
  }

  findAll() {
    return this.prisma.loan.findMany({ include: { employee: true } });
  }

  async findOne(id: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado.`);
    }

    return loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    await this.findOne(id); // Garante que o empréstimo existe
    return this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Garante que o empréstimo existe
    await this.prisma.loan.delete({ where: { id } });
    return { message: `Empréstimo com ID ${id} removido com sucesso.` };
  }
}
