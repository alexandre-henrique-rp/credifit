import LoanSimulationCard from "~/component/credito";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";
import type { Route } from "../+types/root";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Credifit - Internet Banking" },
    { name: "description", content: "Crédito Consignado" },
  ];
}

export default function Credito() {
    return (
      <ProtectedRoute>
      <LoanSimulationCard />
    </ProtectedRoute>
    );
}