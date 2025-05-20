import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, admin, logout } = useAdminAuth();

  // Không hiển thị sidebar cho trang login
  const isLoginPage = location.pathname === '/admin/login';
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (isLoginPage) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    // Nếu không đăng nhập và không phải trang login, component PrivateAdminRoute sẽ chuyển hướng
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">{admin?.email}</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className={`flex items-center p-2 rounded-md ${location.pathname === '/admin/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <FiHome className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={`flex items-center p-2 rounded-md ${location.pathname.includes('/admin/products') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <FiPackage className="mr-3" />
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className={`flex items-center p-2 rounded-md ${location.pathname.includes('/admin/orders') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <FiShoppingBag className="mr-3" />
                Đơn hàng
              </Link>
            </li>
          </ul>
          <div className="pt-8 mt-8 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-700 w-full"
            >
              <FiLogOut className="mr-3" />
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;