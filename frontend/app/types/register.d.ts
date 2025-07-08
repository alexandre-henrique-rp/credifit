/**
 * Interface para dados de cadastro alinhada com os DTOs do backend
 */
export interface RegisterData {
    email: string;
    password: string;
    userType: 'company' | 'employee';
    name: string;
    // Campos específicos para empresa
    cnpj?: string;
    razaoSocial?: string;
    // Campos específicos para funcionário
    cpf?: string;
    salary?: number;
    companyCnpj?: string; // Backend espera companyId, não companyCnpj
}