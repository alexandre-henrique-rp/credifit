import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    console.log(
      '🚀 ~ CompanyService ~ create ~ createCompanyDto:',
      createCompanyDto,
    );
    const { cnpj, password, ...companyData } = createCompanyDto;

    const existingCompany = await this.prisma.company.findUnique({
      where: { cnpj },
    });

    if (existingCompany) {
      throw new ConflictException('Uma empresa com este CNPJ já existe.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const company = await this.prisma.company.create({
      data: {
        ...companyData,
        cnpj,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = company;
    return result;
  }

  async findAll() {
    const companies = await this.prisma.company.findMany();
    return companies.map((company) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = company;
      return result;
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = company;
    return result;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const { password, ...updateData } = updateCompanyDto;

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData['password'] = hashedPassword;
    }

    try {
      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: updateData,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = updatedCompany;
      return result;
    } catch {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.company.delete({ where: { id } });
      return { message: `Empresa com ID ${id} removida com sucesso.` };
    } catch {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }
  }
}
