// Tipos globais para retorno de autenticação

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  userType: string;
  companyId?: number; // ID da empresa, presente apenas para funcionários
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
