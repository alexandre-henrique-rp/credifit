import type { Route } from "./+types/register";
import RegisterComponent from "../component/register";
import { PublicRoute } from "../components/auth/PublicRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Credifit - Cadastro" },
    { name: "description", content: "Cadastro de Empresa ou Funcionário" },
  ];
}

export default function RegisterPage() {
  return (
    <PublicRoute>
      <RegisterComponent />
    </PublicRoute>
  );
}
