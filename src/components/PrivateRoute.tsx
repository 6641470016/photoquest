import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode; // ✅ แก้ตรงนี้
  role: "admin" | "user";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/login" replace />;

  return <>{children}</>; // ✅ ครอบด้วย fragment เพื่อรองรับ ReactNode
};

export default PrivateRoute;
