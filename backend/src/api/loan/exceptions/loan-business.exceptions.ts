import { BadRequestException, ForbiddenException } from '@nestjs/common';

export class CompanyNotPartnerException extends BadRequestException {
  constructor(companyName: string) {
    super(
      `A empresa ${companyName} não é conveniada com a Credifit e seus funcionários não podem solicitar empréstimos.`,
    );
  }
}

export class EmployeeNotAuthorized extends ForbiddenException {
  constructor() {
    super(
      'Funcionário não autorizado a solicitar empréstimo para outro funcionário.',
    );
  }
}

export class EmployeeCompanyMismatchException extends BadRequestException {
  constructor() {
    super(
      'Funcionário não pertence a uma empresa conveniada ou há inconsistência nos dados.',
    );
  }
}