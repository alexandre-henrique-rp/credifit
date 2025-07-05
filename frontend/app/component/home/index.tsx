'use client';

'use client';

import React, { useState } from 'react';
import { Limite } from './limite/limite';
import { InstallmentsComponent } from './parcelas';

const LoanSimulationCard: React.FC = () => {
  const [loanValue, setLoanValue] = useState<number>(0);
  const [installments, setInstallments] = useState<{ count: number; value: number } | null>(null);

  const handleLimiteChange = (value: number) => {
    setLoanValue(value);
  };

  const handleInstallmentsChange = (count: number, value: number) => {
    setInstallments({ count, value });
    // Aqui você pode adicionar a lógica para ir para a próxima tela (resumo)
    console.log(`Resumo: ${count} parcelas de ${value}`);
  };

  const handleBackToLimite = () => {
    setLoanValue(0);
  };

  const renderContent = () => {
    if (loanValue === 0) {
      return <Limite onLimiteChange={handleLimiteChange} />;
    }
    if (loanValue > 0 && !installments) {
      return <InstallmentsComponent loanValue={loanValue} onInstallmentsChange={handleInstallmentsChange} onBack={handleBackToLimite} />;
    }
    // Renderiza a tela de resumo quando as parcelas forem selecionadas
    return (
      <div>
        <h2>Resumo do Empréstimo</h2>
        <p>Valor: {loanValue}</p>
        <p>Parcelas: {installments?.count}</p>
        <p>Valor da Parcela: {installments?.value}</p>
      </div>
    );
  };

  return (
    <div className="max-w-lg w-full px-4">
      <div className="flex items-start gap-x-2 mb-6">
        <button className="text-[#0B0E0E] mt-1">
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