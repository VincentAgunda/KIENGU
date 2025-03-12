import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ role }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Admin can access all pages
  if (userRole === "admin") {
    return <Outlet />;
  }

  // Restrict access for non-admins
  if (userRole !== role) {
    return <Navigate to="/restricted" />; // Redirect to a "Restricted Access" page instead of login
  }

  return <Outlet />;
};

export default ProtectedRoute;
