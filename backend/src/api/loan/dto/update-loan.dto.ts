import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLoanDto } from './create-loan.dto';

export class UpdateLoanDto extends PartialType(
  OmitType(CreateLoanDto, ['employeeId'] as const),
) {}
