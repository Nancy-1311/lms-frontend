import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="flex">
      
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-6">
          <Outlet />   
        </div>
      </div>

    </div>
  );
};

export default MainLayout;