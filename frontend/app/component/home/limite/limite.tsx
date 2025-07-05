import { useState, type ChangeEvent } from "react";
import { formatCurrency } from '~/functions/FormatCurrency';

interface LimiteProps {
    onLimiteChange: (value: number) => void;
}

export function Limite({ onLimiteChange }: LimiteProps) {
  const [loanValue, setLoanValue] = useState<number>(10000);
  const minValue = 500;
  const maxValue = 50000;

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    setLoanValue(Number(value));
  };

  const handleSaveValue = () => {
    onLimiteChange(loanValue);
  };

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoanValue(Number(event.target.value));
  };


  
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[536px]">
      <h2 className="text-xl font-semibold text-[#057D88] mb-4">
        Simular Empréstimo
      </h2>

      <div className="bg-orange-100 p-4 rounded-lg flex items-center mb-6">
        <img
          src="/betina-sorrindo_2x.png"
          alt="Avatar"
          className="w-12 h-12 mr-4"
        />
        <p className="text-sm text-gray-600">
          Você possui saldo para Crédito Consignado pela empresa Seguros
          Seguradora. Faça uma simulação! Digite quanto você precisa:
        </p>
      </div>

      <div className="text-center mb-6">
        <span className="text-3xl font-bold text-gray-600 bg-gray-100 px-6 py-3 rounded-full inline-block">
          {formatCurrency(loanValue)}
        </span>
      </div>

      <div className="mb-8">
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={loanValue}
          onChange={handleRangeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
          style={{
            background: `linear-gradient(to right, #32B7B7 0%, #32B7B7 ${((loanValue - minValue) / (maxValue - minValue)) * 100}%, #E5E7EB ${((loanValue - minValue) / (maxValue - minValue)) * 100}%, #E5E7EB 100%)`,
          }}
        />
      </div>

      <div className="flex w-full items-center justify-end gap-4  ">
        <button className="border border-[#057D88] text-[#057D88] font-semibold text-sm py-2 rounded-full hover:bg-[#057D88] hover:text-white cursor-pointer transition-colors w-[150px]">
          Voltar
        </button>
        <button className="bg-[#057D88] text-white text-sm font-semibold py-2 px-5 rounded-full hover:bg-[#057D88] hover:text-white cursor-pointer transition-colors"
          onClick={handleSaveValue}
        >
          Simular empréstimo
        </button>
        
      </div>
    </div>
  );
}
