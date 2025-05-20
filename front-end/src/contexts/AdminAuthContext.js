import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra nếu admin đã đăng nhập trước đó
    const storedAdmin = localStorage.getItem('admin');
    const adminAuth = localStorage.getItem('adminAuth');
    
    if (storedAdmin && adminAuth) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Failed to parse admin data:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, otp) => {
    try {
      const response = await axios.post('http://localhost:8080/sellers/login', {
        email,
        otp,
      });

      if (response.data.message === 'Login success' && response.data.role === 'ROLE_SELLER') {
        const adminData = { 
          email: response.data.email,
          role: response.data.role,
          jwt: response.data.jwt
        };
        
        // Lưu thông tin xác thực
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('admin', JSON.stringify(adminData));
        
        setAdmin(adminData);
        return { success: true };
      } else if (response.data.role !== 'ROLE_SELLER') {
        return { 
          success: false, 
          error: 'Tài khoản này không có quyền truy cập vào trang quản trị' 
        };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Đăng nhập thất bại' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  const sendOTP = async (email) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/sent/login-signup-otp', {
        email,
        role: 'ROLE_SELLER',
      });

      return {
        success: response.data.message === 'otp sent successfully',
        message: response.data.message
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau'
      };
    }
  };

  const isAuthenticated = !!admin;

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    sendOTP
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};