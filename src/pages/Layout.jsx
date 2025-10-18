import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
    
      <div className="lg:hidden h-0" />
      
      <main className="lg:ml-64 flex-1 min-h-screen overflow-y-auto">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}