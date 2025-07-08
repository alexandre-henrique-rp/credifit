import CompanyHome from "~/components/CompanyHome";
import EmployeeHome from "~/components/EmployeeHome";
import { useAuth } from "~/hook/useAuth";



export default function HomeComponent() {
  const { user } = useAuth();
  console.log("🚀 ~ HomeComponent ~ user:", user)

  return (
    <div className="container mx-auto p-4">
      {user?.userType === 'employee' ? <EmployeeHome /> : <CompanyHome />}
    </div>
  );
}
    