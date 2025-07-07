


export default function HeaderComponent() {
    return (
        <header className="w-full h-12 flex items-center justify-between px-10 sm:px-5 2xl:px-20 bg-[#057D88]">
        <div className="p-3 h-12">
          <img src="/logo.png" alt="Credifit Logo" className="h-6" />
        </div>
        <div className="p-3 flex items-center gap-4">
          <img src="/Group.png" alt="User" className="h-5" />
          
        </div>
      </header>
    );
}