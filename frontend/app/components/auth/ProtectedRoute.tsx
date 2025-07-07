import { Navigate } from "react-router";
import { useAuth } from "../../hook/useAuth";
import type { ReactNode } from "react";

/**
 * Componente para proteger rotas que requerem autenticação
 * 
 * Este componente verifica se o usuário está autenticado antes de renderizar
 * o conteúdo protegido. Se não estiver autenticado, redireciona para login.
 * 
 * @param children - Componentes filhos que serão renderizados se autenticado
 * @param redirectTo - Rota para redirecionamento (padrão: "/login")
 */
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  console.log("🚀 ~ isAuthenticated:", isAuthenticated)

  // Exibe loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#057D88]"></div>
      </div>
    );
  }

  // Redireciona para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Renderiza conteúdo protegido se autenticado
  return <>{children}</>;
};
