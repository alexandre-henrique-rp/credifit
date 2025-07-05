export enum LoanStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

export interface Loan {
  id: number;
  employeeId: number;
  amount: number;
  installments: number;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}
