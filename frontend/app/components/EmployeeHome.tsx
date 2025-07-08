import React from "react";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Accordion from "./common/Accordion"; // Reutilizaremos o Accordion, mas com conteúdo mais rico
import { useAuth } from "~/hook/useAuth";

// Tipagem expandida para os dados de um empréstimo, conforme o design
interface Loan {
  id: string;
  type: "Solicitação" | "Corrente";
  title: string;
  status: "Reprovado por score" | "Crédito aprovado" | "Em análise";
  statusColor: "red" | "green" | "yellow";
  company: string;
  nextDueDate: string;
  installments: number;
  installmentValue: number;
  totalFinanced?: number; // Opcional, pois só aparece no empréstimo corrente
}

// Dados mocados atualizados para refletir o design
const mockLoans: Loan[] = [
  {
    id: "1",
    type: "Solicitação",
    title: "SOLICITAÇÃO DE EMPRÉSTIMO 01",
    status: "Reprovado por score",
    statusColor: "red",
    company: "Seguros Seguradora",
    nextDueDate: "29/11/2022",
    installments: 2,
    installmentValue: 5000
  },
  {
    id: "2",
    type: "Corrente",
    title: "EMPRÉSTIMO CORRENTE 02",
    status: "Crédito aprovado",
    statusColor: "green",
    company: "Seguros Seguradora",
    nextDueDate: "29/11/2022",
    installments: 1,
    installmentValue: 5000,
    totalFinanced: 10000
  }
];

// Mapeamento de cores para o status, usando classes do Tailwind
const statusColorMap = {
  red: "bg-red-100 text-red-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700"
};

const EmployeeHome: React.FC = () => {
  const navigate = useNavigate();
  const { loan } = useAuth();
  
  const handleNewLoan = () => {
    navigate("/credito");
  };

  /**
   * Componente para a página inicial do funcionário, com layout ajustado ao design.
   */
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho de Navegação */}
        <div className="flex items-start gap-x-2 mb-6">
          <button className="text-[#0B0E0E] mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 mt-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div>
            <div className="mb-1 flex gap-x-2 text-sm">
              <span className="text-[#535F5F]">Home /</span>{" "}
              <span className="text-[#2A3535]">Crédito Consignado</span>
            </div>
            <h1 className="text-2xl font-bold text-[#057D88]">
              Crédito Consignado
            </h1>
          </div>
        </div>

        {/* Card Principal */}
        <div className="card p-6">
          {/* Banner de Notificação */}
          <div className="bg-orange-100 text-orange-700 p-4 rounded-lg flex items-center mb-6">
            <img
              src="/betina-sorrindo_2x.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full mr-4"
            />
            <p>
              Você solicitou seu empréstimo! Agora aguarde as etapas de análises
              serem concluídas!
            </p>
          </div>

          {/* Lista de Empréstimos */}
          <div className="space-y-4">
            {mockLoans.map((loan) => (
              <Accordion
                key={loan.id}
                title={
                  <div className="flex items-center font-semibold text-gray-600">
                    {loan.type === "Solicitação" ? (
                      <FiClock className="mr-3 text-orange-500" />
                    ) : (
                      <FiCheckCircle className="mr-3 text-teal-500" />
                    )}
                    {loan.title}
                  </div>
                }
              >
                <div
                  className={`p-4 rounded-md mb-4 ${
                    statusColorMap[loan.statusColor]
                  }`}
                >
                  {loan.status}
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <p className="text-gray-500">Empresa</p>
                    <p className="font-semibold">{loan.company}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Próximo Vencimento</p>
                    <p className="font-semibold">{loan.nextDueDate}</p>
                  </div>
                  {loan.totalFinanced && (
                    <div>
                      <p className="text-gray-500">Total Financiado</p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        }).format(loan.totalFinanced)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Valor da Parcela</p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(loan.installmentValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Número de parcelas</p>
                    <p className="font-semibold">{loan.installments}x</p>
                  </div>
                </div>
                {loan.type === "Solicitação" && (
                  <a
                    href="#"
                    className="text-teal-600 font-semibold mt-4 inline-block"
                  >
                    Mais detalhes
                  </a>
                )}
              </Accordion>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="bg-[#057D88] text-white text-sm font-semibold py-2 px-5 rounded-full hover:bg-[#057D88] hover:text-white cursor-pointer transition-colors" onClick={handleNewLoan}>
            Novo empréstimo
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
