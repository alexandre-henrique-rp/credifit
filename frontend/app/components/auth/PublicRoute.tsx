import { Navigate } from "react-router";
import { useAuth } from "../../hook/useAuth";
import type { ReactNode } from "react";

/**
 * Componente para rotas públicas (como login)
 * 
 * Este componente redireciona usuários já autenticados para a página inicial,
 * evitando que acessem páginas como login quando já estão logados.
 * 
 * @param children - Componentes filhos que serão renderizados se não autenticado
 * @param redirectTo - Rota para redirecionamento se autenticado (padrão: "/")
 */
interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ 
  children, 
  redirectTo = "/" 
}: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Exibe loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#057D88]"></div>
      </div>
    );
  }

  // Redireciona para home se já autenticado
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Renderiza conteúdo público se não autenticado
  return <>{children}</>;
};
