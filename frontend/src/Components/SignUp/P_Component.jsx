import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const P_Component = () => {
  const lS = localStorage.getItem("user");
  return lS ? <Outlet /> : <Navigate to="/login" />;
};

export default P_Component;
