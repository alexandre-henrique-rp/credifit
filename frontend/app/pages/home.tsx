import type { Route } from "./+types/home";
import LoanSimulationCard from "~/component/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Credifit - Internet Banking" },
    { name: "description", content: "Crédito Consignado" },
  ];
}

export default function Home() {
  return <LoanSimulationCard />;
}
