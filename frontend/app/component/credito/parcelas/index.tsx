import { useState } from "react";
import { formatCurrency } from "~/functions/FormatCurrency";

interface InstallmentsProps {
  onInstallmentsChange: (
    installments: number,
    installmentValue: number
  ) => void;
  loanValue: number;
  onBack: () => void;

}

export function InstallmentsComponent({
  onInstallmentsChange,
  loanValue,
  onBack,
}: InstallmentsProps) {
  const [selectedInstallment, setSelectedInstallment] = useState<number | null>(
    null
  );


  const installmentOptions = [1, 2, 3, 4];

  const handleSelectInstallment = (installments: number) => {
    setSelectedInstallment(installments);
  };

  const handleNext = () => {
    if (selectedInstallment) {
      const installmentValue = loanValue / selectedInstallment;
      onInstallmentsChange(selectedInstallment, installmentValue);
    }
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
          Escolha a opção de parcelamento que melhor funcionar para você:
        </p>
      </div>

      <div className="text-center mb-4">
        <span className="text-3xl font-bold text-gray-700">
          {formatCurrency(loanValue)}
        </span>
      </div>

      <div className="mb-8">
        <p className="text-gray-600 mb-4">Divididas em:</p>
        <div className="grid grid-cols-2 gap-4">
          {installmentOptions.map((installments) => {
            const installmentValue = loanValue / installments;
            const isSelected = selectedInstallment === installments;

            return (
              <button
                key={installments}
                onClick={() => handleSelectInstallment(installments)}
                className={`relative text-left p-2.5 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? "border-transparent bg-[#FFD899]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg bg-orange-500`}
                ></div>
                <div className="pl-4">
                  <span className="text-lg text-gray-800">
                    {installments}x de{" "}
                  </span>
                  <span className="text-lg font-bold text-[#057D88]">
                    {formatCurrency(installmentValue)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onBack}
          className="border border-teal-500 text-teal-500 font-semibold py-2 text-sm rounded-full hover:bg-teal-50 transition-colors w-[150px]"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedInstallment}
          className="bg-teal-500 text-white font-semibold py-2 px-5 text-sm rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-600" 
        >
          Seguinte
        </button>
      </div>
    </div>
  );
}
