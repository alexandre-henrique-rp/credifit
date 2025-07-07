// Tipos globais para retorno de autenticação

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  userType: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
