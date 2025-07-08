import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import Accordion from './common/Accordion';

// Tipagem para os dados de um funcionário
interface Employee {
  id: string;
  name: string;
  loanCount: number;
  totalLoanValue: number;
}

// Dados mocados para simular a lista de funcionários
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'João da Silva',
    loanCount: 2,
    totalLoanValue: 15000,
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    loanCount: 0,
    totalLoanValue: 0,
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    loanCount: 5,
    totalLoanValue: 45000,
  },
  {
    id: '4',
    name: 'Ana Souza',
    loanCount: 1,
    totalLoanValue: 3000,
  },
];

/**
 * Componente para a página inicial da empresa, com layout ajustado.
 */
const CompanyHome: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho de Navegação */}
        <div className="flex items-center text-gray-500 mb-4">
          <FiChevronLeft className="mr-2" />
          <span>Home / Funcionários</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão de Funcionários</h1>

        {/* Card Principal */}
        <div className="card p-6">
          {/* Lista de Funcionários */}
          <div className="space-y-4">
            {mockEmployees.map((employee) => (
              <Accordion 
                key={employee.id} 
                title={<span className="font-semibold text-gray-600">{employee.name}</span>}
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <p className="text-gray-500">Empréstimos Ativos</p>
                    <p className="font-semibold">{employee.loanCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valor Total em Empréstimos</p>
                    <p className="font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(employee.totalLoanValue)}</p>
                  </div>
                </div>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="btn btn-primary">+ Adicionar Funcionário</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyHome;


