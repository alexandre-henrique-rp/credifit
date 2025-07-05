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
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';

@ApiTags('Funcionários (Employee)')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo funcionário' })
  @ApiCreatedResponse({ type: EmployeeEntity })
  @ApiConflictResponse({ description: 'CPF já cadastrado' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os funcionários' })
  @ApiOkResponse({ type: [EmployeeEntity] })
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um funcionário pelo ID' })
  @ApiOkResponse({ type: EmployeeEntity })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um funcionário pelo ID' })
  @ApiOkResponse({ type: EmployeeEntity })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  @ApiConflictResponse({ description: 'CPF já está em uso' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um funcionário pelo ID' })
  @ApiOkResponse({ description: 'Funcionário removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.remove(id);
  }
}
