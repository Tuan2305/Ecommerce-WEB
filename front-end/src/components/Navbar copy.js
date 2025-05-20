import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount } = useCart() || { cartCount: 0 }; // Thêm fallback
  const { currentUser, logout } = useAuth() || { currentUser: null, logout: () => {} }; // Thêm fallback
  const navigate = useNavigate();
  
  const categories = ['Áo', 'Quần', 'Váy', 'Phụ kiện', 'Giày dép', 'Sale'];
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };
  
  // Tạo display name an toàn
  const getDisplayName = () => {
    if (!currentUser) return '';
    if (currentUser.name) return currentUser.name;
    if (currentUser.email && typeof currentUser.email === 'string') {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };
  
  // Tạo avatar letter an toàn
  const getAvatarLetter = () => {
    if (!currentUser) return 'U';
    if (currentUser.name && currentUser.name.length > 0) {
      return currentUser.name[0].toUpperCase();
    }
    if (currentUser.email && typeof currentUser.email === 'string' && currentUser.email.length > 0) {
      return currentUser.email[0].toUpperCase();
    }
    return 'U';
  };
  
  return (
    <nav className="bg-primary text-white">
      {/* Top navbar */}
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="mr-4 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-bold">FashionStore</Link>
        </div>
        
        {/* Search bar */}
        <div className="hidden md:block flex-1 mx-10 relative">
          <div className="flex">
            <input 
              type="text" 
              className="w-full p-2 text-dark rounded-l-md focus:outline-none"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-secondary text-white px-4 rounded-r-md hover:bg-opacity-90 transition">
              <FiSearch className="text-lg" />
            </button>
          </div>
        </div>
        
        {/* User actions */}
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative">
            <FiShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {currentUser ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-1"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-bold text-sm">{getAvatarLetter()}</span>
                </div>
                <span className="hidden md:inline-block">{getDisplayName()}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                  <div className="py-2">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FiLogOut className="mr-2" />
                        Đăng xuất
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center">
              <FiUser className="text-2xl md:mr-1" />
              <span className="hidden md:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="md:hidden px-4 py-2">
        <div className="flex">
          <input 
            type="text" 
            className="w-full p-2 text-dark rounded-l-md focus:outline-none"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-secondary text-white px-4 rounded-r-md hover:bg-opacity-90 transition">
            <FiSearch className="text-lg" />
          </button>
        </div>
      </div>
      
      {/* Categories navbar */}
      <div className="bg-secondary relative">
        <div className="container mx-auto px-4 py-2">
          <ul className="hidden md:flex space-x-6 justify-center">
            {categories.map((category, index) => (
              <li key={index}>
                <Link to={`/category/${category.toLowerCase()}`} className="hover:text-gray-200 transition">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-primary z-50 md:hidden">
            <div className="py-2 px-4">
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link 
                      to={`/category/${category.toLowerCase()}`} 
                      className="block py-2 hover:bg-secondary px-2 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;