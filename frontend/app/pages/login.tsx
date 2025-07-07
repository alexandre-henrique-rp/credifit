import LoginComponent from "../component/login";
import { PublicRoute } from "../components/auth/PublicRoute";

/**
 * Página de Login
 * 
 * Esta página é protegida por PublicRoute, que redireciona usuários
 * já autenticados para a página inicial, evitando acesso desnecessário
 * à tela de login quando já estão logados.
 */
export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginComponent />
    </PublicRoute>
  );
}

