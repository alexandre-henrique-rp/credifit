import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback
} from "react";

import apiClient from "~/api";

/**
 * Interface que define a estrutura do usuário autenticado
 */
interface User {
  id: number;
  name: string;
  email: string;
  userType: "employee" | "company";
}
interface Loan {
  id: number;
  
}

/**
 * Interface do contexto de autenticação
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loan: Loan | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

/**
 * Contexto de autenticação
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * Provider do contexto de autenticação
 * Gerencia o estado de autenticação e fornece métodos para login/logout
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState<Loan | null>(null);

  /**
   * Efeito para verificar e recuperar sessão existente na inicialização
   */
  /**
   * Efeito para verificar e recuperar sessão existente na inicialização
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userString = localStorage.getItem("user");

      if (token && userString) {
        try {
          const user = JSON.parse(userString);

          // Garante que temos um usuário válido no localStorage
          if (user?.id && user?.userType) {
            // Valida o token e busca os dados mais recentes do usuário
            const responseData = await apiClient.auth.me(user.id, user.userType);
            const DataUser = {
              ...responseData.user,
              userType: user.userType,
            }
            setUser(DataUser);

            if (user.userType === "employee") {
              const loanResponse = await apiClient.getLoans(user.id);
              const loanData = loanResponse.data;
              setLoan(loanData);
            }
          } else {
            throw new Error("Dados de usuário inválidos no localStorage");
          }
        } catch (error) {
          // Se a validação falhar (token expirado, etc.), limpa tudo
          console.warn("Falha ao re-autenticar, limpando sessão:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setUser(null);
        }
      }

      // Finaliza o carregamento após a tentativa de autenticação
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Método para realizar login do usuário
   */
  const signIn = useCallback(async (data: any) => {
    try {
      const { email, password, userType } = data;
      const response = await apiClient.auth.login(email, password, userType);
      const { token, user } = response;
      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error; // Re-throw para que o componente possa tratar
    }
  }, []);

  /**
   * Método para realizar logout do usuário
   */
  const signOut = useCallback(async () => {
    try {
      // Chama o endpoint de logout (se existir)
      await apiClient.auth.logout();
    } catch (error) {
      console.warn("Erro no logout:", error);
    } finally {
      // Limpa o estado local independentemente do resultado
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      
    }
  }, []);

  const value = {
    isAuthenticated: !!user,
    user,
    loan,
    signIn,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
