import { useAuth } from "../../hook/useAuth";
import type { ReactNode } from "react";

/**
 * Componente AuthGuard para controle de acesso baseado em tipo de usuário
 * 
 * Este componente permite controlar o acesso a funcionalidades específicas
 * baseado no tipo de usuário (employee ou company).
 * 
 * @param children - Componentes filhos que serão renderizados se autorizado
 * @param allowedUserTypes - Tipos de usuário permitidos
 * @param fallback - Componente a ser exibido se não autorizado
 */
interface AuthGuardProps {
  children: ReactNode;
  allowedUserTypes: Array<"employee" | "company">;
  fallback?: ReactNode;
}

export const AuthGuard = ({ 
  children, 
  allowedUserTypes, 
  fallback = null 
}: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuth();

  // Se não estiver autenticado, não renderiza nada
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Verifica se o tipo de usuário está autorizado
  const isAuthorized = allowedUserTypes.includes(user.userType);

  if (!isAuthorized) {
    return (
      <>{fallback || (
        <div className="flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <h3 className="text-red-800 font-medium mb-2">Acesso Negado</h3>
            <p className="text-red-600 text-sm">
              Você não tem permissão para acessar esta funcionalidade.
            </p>
          </div>
        </div>
      )}</>
    );
  }

  return <>{children}</>;
};
