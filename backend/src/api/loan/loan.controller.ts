import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanEntity } from './entities/loan.entity';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.types';

@ApiTags('Empréstimos (Loan)')
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo empréstimo' })
  @ApiCreatedResponse({ type: LoanEntity })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  create(@Body() createLoanDto: CreateLoanDto, @Request() req: { user: AuthUser }) {
    return this.loanService.create(createLoanDto, req.user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os empréstimos' })
  @ApiOkResponse({ type: [LoanEntity] })
  findAll() {
    return this.loanService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar um empréstimo pelo ID' })
  @ApiOkResponse({ type: LoanEntity })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loanService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um empréstimo pelo ID' })
  @ApiOkResponse({ type: LoanEntity })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoanDto: UpdateLoanDto,
  ) {
    return this.loanService.update(id, updateLoanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um empréstimo pelo ID' })
  @ApiOkResponse({ description: 'Empréstimo removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loanService.remove(id);
  }

  @Get('margin/:employeeId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar margem consignável disponível' })
  @ApiOkResponse({ description: 'Informações de margem consignável' })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  getConsignableMargin(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.loanService.getConsignableInfo(employeeId);
  }
}
