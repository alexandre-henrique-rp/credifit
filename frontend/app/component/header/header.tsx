import { useAuth } from "~/hook/useAuth";
import DropdownMenu from '~/component/dropdown/DropdownMenu';
import '~/component/dropdown/dropdown.css';



export default function HeaderComponent() {
    const { user } = useAuth();
    return (
        <header className="w-full h-12 flex items-center justify-between px-10 sm:px-5 2xl:px-20 bg-[#057D88]">
        <div className="p-3 h-12">
          <img src="/logo.png" alt="Credifit Logo" className="h-6" />
        </div>
        <div className="p-3 flex items-center gap-4">
          <img src="/Group.png" alt="User" className="h-5" />
          <div className="flex gap-2 items-center">
            <p className="font-semibold text-white">{user?.name}</p>
            <DropdownMenu />
          </div>
        </div>
      </header>
    );
}