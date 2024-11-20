import React from "react";
import Navbar from "../Navbar/navbar";
import { Outlet } from "react-router-dom";
function MainLayout(props) {
  return (
    <div>
      <Navbar />
      {/* Outlet sẽ render các route con */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
