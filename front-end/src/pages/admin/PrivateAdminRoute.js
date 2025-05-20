import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const PrivateAdminRoute = () => {
  const { isAuthenticated, loading } = useAdminAuth();

  // Hiển thị loading nếu đang kiểm tra trạng thái xác thực
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateAdminRoute;