import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


function ProtectedRoute({ children }) {

  const token = localStorage.getItem('token');

  if (!token) {
r
    return <Navigate to="/login" replace />;
  }

   return children ? children : <Outlet />;
}

export default ProtectedRoute;