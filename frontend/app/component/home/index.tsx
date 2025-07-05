'use client';

import React, { useState } from 'react';
import { Limite } from './limite/limite';
import { InstallmentsComponent } from './parcelas';
import { createLoan } from '../../functions/api';
import { Loan } from '../../types';

const LoanSimulationCard: React.FC = () => {
  const [loanValue, setLoanValue] = useState<number>(0);
  const [installmentsCount, setInstallmentsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loanResult, setLoanResult] = useState<Loan | null>(null);

  const handleLimiteChange = (value: number) => {
    setLoanValue(value);
  };

  const handleInstallmentsChange = async (count: number) => {
    setInstallmentsCount(count);
    setLoading(true);
    setError(null);

    try {
      // Usando um employeeId fixo (1) para teste, pois não há autenticação
      const payload = { employeeId: 1, amount: loanValue, installments: count };
      const result = await createLoan(payload);
      setLoanResult(result);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLimite = () => {
    setLoanValue(0);
    setInstallmentsCount(null);
    setLoanResult(null);
    setError(null);
  };

  const renderContent = () => {
    if (loading) {
      return <div>Analisando sua solicitação...</div>;
    }

    if (error) {
      return (
        <div>
          <h2 className="text-red-500">Erro na Solicitação</h2>
          <p>{error}</p>
          <button onClick={handleBackToLimite} className="text-sm text-blue-600 mt-4">Tentar novamente</button>
        </div>
      );
    }

    if (loanResult) {
      return (
        <div>
          <h2>Resultado da Simulação</h2>
          <p>Status: <span className={loanResult.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}>{loanResult.status}</span></p>
          <p>Valor Solicitado: R$ {loanResult.amount.toFixed(2)}</p>
          <p>Parcelas: {loanResult.installments}</p>
          <button onClick={handleBackToLimite} className="text-sm text-blue-600 mt-4">Simular novamente</button>
        </div>
      );
    }

    if (loanValue > 0 && !installmentsCount) {
      return <InstallmentsComponent loanValue={loanValue} onInstallmentsChange={handleInstallmentsChange} onBack={handleBackToLimite} />;
    }

    return <Limite onLimiteChange={handleLimiteChange} />;
  };

  return (
    <div className="max-w-lg w-full px-4">
      <div className="flex items-start gap-x-2 mb-6">
        <button className="text-[#0B0E0E] mt-1" onClick={handleBackToLimite}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div>
          <div className="mb-1 flex gap-x-2 text-sm">
            <span className="text-[#535F5F]">Home /</span> <span className="text-[#2A3535]">Crédito Consignado</span>
          </div>
          <h1 className="text-2xl font-bold text-[#057D88]">
            Crédito Consignado
          </h1>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default LoanSimulationCard;