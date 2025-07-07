import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import HeaderComponent from "./component/header/header";

export default function Layout() {
  return (
    <>
    <Toaster position="top-right" />
    <div className="w-full h-full flex flex-col">
      <HeaderComponent />
      <main className="flex pt-5 align-center justify-center overflow-y-auto">
        <Outlet />
      </main>
    </div>
    </>
  );
}
