import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function PrivateRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
