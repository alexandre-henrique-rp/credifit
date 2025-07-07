import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import apiClient from '~/api';

/**
 * Tipos de usuário disponíveis para cadastro
 */
type UserType = 'company' | 'employee';

/**
 * Interface para dados de cadastro de empresa
 */
interface CompanyFormData {
  name: string;
  razaoSocial: string;
  email: string;
  password: string;
  confirmPassword: string;
  cnpj: string;
}

/**
 * Interface para dados de cadastro de funcionário
 */
interface EmployeeFormData {
  name: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword: string;
  salary: string;
  companyCnpj: string;
}

/**
 * Componente de Cadastro
 * 
 * Permite cadastro condicional de empresas e funcionários com validação
 * de campos específicos para cada tipo de usuário.
 */
const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('company');
  const [loading, setLoading] = useState(false);

  // Estados para formulário de empresa
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    name: '',
    razaoSocial: '',
    email: '',
    password: '',
    confirmPassword: '',
    cnpj: ''
  });

  // Estados para formulário de funcionário
  const [employeeData, setEmployeeData] = useState<EmployeeFormData>({
    name: '',
    cpf: '',
    email: '',
    password: '',
    confirmPassword: '',
    salary: '',
    companyCnpj: ''
  });

  /**
   * Valida CNPJ (validação básica de formato)
   */
  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  /**
   * Valida CPF (validação básica de formato)
   */
  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  /**
   * Valida email
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Manipula mudanças no formulário de empresa
   */
  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Manipula mudanças no formulário de funcionário
   */
  const handleEmployeeChange = (field: keyof EmployeeFormData, value: string) => {
    setEmployeeData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Valida formulário de empresa
   */
  const validateCompanyForm = (): string | null => {
    if (!companyData.name.trim()) return 'Nome da empresa é obrigatório';
    if (!companyData.email.trim()) return 'Email é obrigatório';
    if (!validateEmail(companyData.email)) return 'Email inválido';
    if (!companyData.password) return 'Senha é obrigatória';
    if (companyData.password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    if (companyData.password !== companyData.confirmPassword) return 'Senhas não coincidem';
    if (!companyData.cnpj.trim()) return 'CNPJ é obrigatório';
    if (!validateCNPJ(companyData.cnpj)) return 'CNPJ inválido';
    return null;
  };

  /**
   * Valida formulário de funcionário
   */
  const validateEmployeeForm = (): string | null => {
    if (!employeeData.name.trim()) return 'Nome é obrigatório';
    if (!employeeData.cpf.trim()) return 'CPF é obrigatório';
    if (!validateCPF(employeeData.cpf)) return 'CPF inválido';
    if (!employeeData.email.trim()) return 'Email é obrigatório';
    if (!validateEmail(employeeData.email)) return 'Email inválido';
    if (!employeeData.password) return 'Senha é obrigatória';
    if (employeeData.password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    if (employeeData.password !== employeeData.confirmPassword) return 'Senhas não coincidem';
    if (!employeeData.salary.trim()) return 'Salário é obrigatório';
    if (isNaN(Number(employeeData.salary)) || Number(employeeData.salary) <= 0) return 'Salário deve ser um valor válido';
    if (!employeeData.companyCnpj.trim()) return 'CNPJ da empresa é obrigatório';
    if (!validateCNPJ(employeeData.companyCnpj)) return 'CNPJ da empresa inválido';
    return null;
  };

  /**
   * Submete o formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação
      const error = userType === 'company' ? validateCompanyForm() : validateEmployeeForm();
      if (error) {
        toast.error(error);
        return;
      }

      // Preparar dados para envio
      const payload = userType === 'company' 
        ? {
            userType: 'company' as const,
            name: companyData.name,
            razaoSocial: companyData.razaoSocial || companyData.name,
            email: companyData.email,
            password: companyData.password,
            cnpj: companyData.cnpj.replace(/\D/g, '')
          }
        : {
            userType: 'employee' as const,
            name: employeeData.name,
            cpf: employeeData.cpf.replace(/\D/g, ''),
            email: employeeData.email,
            password: employeeData.password,
            salary: parseFloat(employeeData.salary),
            // TODO: Implementar busca de companyId pelo CNPJ
            // Por enquanto, vamos usar um valor temporário
            companyId: 1 // Será substituído pela lógica de busca
          };

      // Aqui você faria a chamada para a API
      console.log('Dados para cadastro:', payload);
      
      const response = await apiClient.register(payload);
      // Simulação de sucesso
      if (response) {
        toast.success('Cadastro realizado com sucesso!');
        navigate('/login');
      }

    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formata CNPJ enquanto digita
   */
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  /**
   * Formata CPF enquanto digita
   */
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="max-w-screen h-screen w-full px-4 flex justify-center items-center bg-[#057D88]">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-lg shadow-gray-500 p-6">
        {/* Seletor de tipo de usuário */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Cadastro
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUserType('company')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                userType === 'company'
                  ? 'border-[#057D88] bg-[#057D88] text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-[#057D88]'
              }`}
            >
              Empresa
            </button>
            <button
              type="button"
              onClick={() => setUserType('employee')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                userType === 'employee'
                  ? 'border-[#057D88] bg-[#057D88] text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-[#057D88]'
              }`}
            >
              Funcionário
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {userType === 'company' ? (
            // Formulário para empresa
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => handleCompanyChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="Digite o nome da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social
                </label>
                <input
                  type="text"
                  value={companyData.razaoSocial}
                  onChange={(e) => handleCompanyChange('razaoSocial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="Digite a razão social (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formatCNPJ(companyData.cnpj)}
                  onChange={(e) => handleCompanyChange('cnpj', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={companyData.email}
                  onChange={(e) => handleCompanyChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="empresa@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha *
                </label>
                <input
                  type="password"
                  value={companyData.password}
                  onChange={(e) => handleCompanyChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  value={companyData.confirmPassword}
                  onChange={(e) => handleCompanyChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="Digite a senha novamente"
                />
              </div>
            </>
          ) : (
            // Formulário para funcionário
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={employeeData.name}
                  onChange={(e) => handleEmployeeChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formatCPF(employeeData.cpf)}
                  onChange={(e) => handleEmployeeChange('cpf', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={employeeData.email}
                  onChange={(e) => handleEmployeeChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salário *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={employeeData.salary}
                  onChange={(e) => handleEmployeeChange('salary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ da Empresa *
                </label>
                <input
                  type="text"
                  value={formatCNPJ(employeeData.companyCnpj)}
                  onChange={(e) => handleEmployeeChange('companyCnpj', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha *
                </label>
                <input
                  type="password"
                  value={employeeData.password}
                  onChange={(e) => handleEmployeeChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  value={employeeData.confirmPassword}
                  onChange={(e) => handleEmployeeChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
                  placeholder="Digite a senha novamente"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#057D88] text-white py-3 px-4 rounded-md hover:bg-[#046a73] focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#057D88] hover:underline font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
