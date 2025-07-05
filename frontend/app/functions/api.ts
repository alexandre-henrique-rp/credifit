import type { Loan } from '../types';

const API_BASE_URL = 'http://localhost:3000';

interface CreateLoanPayload {
  employeeId: number;
  amount: number;
  installments: number;
}

export const createLoan = async (payload: CreateLoanPayload): Promise<Loan> => {
  const response = await fetch(`${API_BASE_URL}/loan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao criar o empréstimo.');
  }

  return response.json();
};

