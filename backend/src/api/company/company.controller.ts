import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova empresa' })
  @ApiCreatedResponse({
    description: 'Empresa criada com sucesso.',
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiConflictResponse({ description: 'CNPJ já cadastrado.' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as empresas' })
  @ApiOkResponse({
    description: 'Lista de empresas.',
    type: Company,
    isArray: true,
  })
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma empresa pelo ID' })
  @ApiOkResponse({ description: 'Empresa encontrada.', type: Company })
  @ApiNotFoundResponse({ description: 'Empresa não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma empresa pelo ID' })
  @ApiOkResponse({
    description: 'Empresa atualizada com sucesso.',
    type: Company,
  })
  @ApiNotFoundResponse({ description: 'Empresa não encontrada.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma empresa pelo ID' })
  @ApiOkResponse({ description: 'Empresa removida com sucesso.' })
  @ApiNotFoundResponse({ description: 'Empresa não encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }
}
