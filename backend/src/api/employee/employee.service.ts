import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { cpf, companyId, password } = createEmployeeDto;

    const existingEmployee = await this.prisma.employee.findUnique({
      where: { cpf },
    });
    if (existingEmployee) {
      throw new ConflictException(`Funcionário com CPF ${cpf} já cadastrado.`);
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException(
        `Empresa com ID ${companyId} não encontrada.`,
      );
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = employee;
    return result;
  }

  async findAll() {
    const employees = await this.prisma.employee.findMany();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return employees.map(({ password: _, ...rest }) => rest);
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = employee;
    return result;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const { password, cpf, ...updateData } = updateEmployeeDto;

    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!existingEmployee) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado.`);
    }

    if (cpf && cpf !== existingEmployee.cpf) {
      const employeeWithSameCpf = await this.prisma.employee.findUnique({
        where: { cpf },
      });
      if (employeeWithSameCpf) {
        throw new ConflictException(
          `CPF ${cpf} já está em uso por outro funcionário.`,
        );
      }
    }

    const dataToUpdate: Prisma.EmployeeUpdateInput = { ...updateData };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    if (cpf) {
      dataToUpdate.cpf = cpf;
    }

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: dataToUpdate,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = updatedEmployee;
    return result;
  }

  async remove(id: number) {
    await this.findOne(id); // Check if employee exists
    await this.prisma.employee.delete({ where: { id } });
    return { message: `Funcionário com ID ${id} removido com sucesso.` };
  }
}
