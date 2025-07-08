import type { Route } from "./+types/home";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";
import HomeComponent from "~/component/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Credifit - Internet Banking" },
    { name: "description", content: "Crédito Consignado" },
  ];
}

export default function Home() {
  return (
     <ProtectedRoute>
      <HomeComponent />
     </ProtectedRoute>
  );
};
