import type { Route } from "./+types/home";
import LoanSimulationCard from "~/component/home";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Credifit - Internet Banking" },
    { name: "description", content: "Crédito Consignado" },
  ];
}

/**
 * Página Principal (Home)
 * 
 * Esta página é protegida e só pode ser acessada por usuários autenticados.
 * Contém o simulador de empréstimos e outras funcionalidades principais.
 */
export default function Home() {
  return (
    <ProtectedRoute>
      <LoanSimulationCard />
    </ProtectedRoute>
  );
}
