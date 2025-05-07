
import { ReactNode } from  "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from  "@/components/ui/toaster";



const MainLayout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-recipe-light dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full dark:text-gray-100">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
