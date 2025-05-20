import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  // Tải dữ liệu giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage', error);
      }
    }
  }, []);

  // Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1, size, color) => {
    setCartItems(prevItems => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (cùng size và màu)
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
        updatedItems = [
          ...prevItems,
          {
            ...product,
            quantity,
            size,
            color
          }
        ];
      }

      return updatedItems;
    });

    // Hiển thị thông báo
    showNotification('success', 'Đã thêm sản phẩm vào giỏ hàng!');
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = (id, size, color, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id, size, color) => {
    setCartItems(prevItems =>
      prevItems.filter(item => 
        !(item.id === id && item.size === size && item.color === color)
      )
    );
    showNotification('info', 'Đã xóa sản phẩm khỏi giỏ hàng');
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    showNotification('info', 'Giỏ hàng đã được làm trống');
  };

  // Hàm hiển thị thông báo
  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        isVisible: false
      }));
    }, 3000);
  };

  // Đóng thông báo
  const closeNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tổng tiền giỏ hàng
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    notification,
    closeNotification
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};