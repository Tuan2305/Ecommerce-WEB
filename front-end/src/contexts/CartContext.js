import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
  const [isLoading, setIsLoading] = useState(false);

  // Tải dữ liệu giỏ hàng từ server
  const fetchCartFromServer = async () => {
    const token = localStorage.getItem('jwt');
    
    // Nếu không có token, load từ localStorage
    if (!token) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error('Error parsing cart from localStorage', error);
        }
      }
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching cart from server...');
      const response = await axios.get('http://localhost:8080/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Cart server response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Transform API response to match our cartItems format
        const transformedItems = response.data.map(item => ({
          id: item.product.id,
          name: item.product.title,
          price: item.product.sellingPrice,
          originalPrice: item.product.price > item.product.sellingPrice ? item.product.price : null,
          image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : null,
          quantity: item.quantity,
          size: item.size,
          color: item.product.color
        }));
        
        console.log('Transformed cart items:', transformedItems);
        setCartItems(transformedItems);
      }
    } catch (error) {
      console.error('Error fetching cart from server:', error);
      
      // Fallback to localStorage if API fails
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error('Error parsing cart from localStorage', error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Tải dữ liệu giỏ hàng khi component mount
  useEffect(() => {
    fetchCartFromServer();
  }, []);

  // Lưu giỏ hàng vào localStorage khi thay đổi (backup)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product, quantity = 1, size, color) => {
    const token = localStorage.getItem('jwt');
    console.log('Adding to cart:', {product, quantity, size, color});
    
    // Nếu đã đăng nhập, gọi API 
    if (token) {
      try {
        const cartItem = {
          productId: product.id,
          quantity: quantity,
          size: size,
          color: color || product.color // Đảm bảo luôn có giá trị color
        };
        
        console.log('Sending API request to add item...');
        
        // Thêm vào local state trước để UI cập nhật ngay
        const newItem = {
          id: product.id,
          name: product.title || product.name,
          price: product.sellingPrice || product.price,
          originalPrice: product.price > product.sellingPrice ? product.price : null,
          image: product.images && product.images.length > 0 ? product.images[0] : product.image,
          quantity: quantity,
          size: size,
          color: color || product.color
        };
        
        setCartItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(
            item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += quantity;
            return updatedItems;
          } else {
            return [...prevItems, newItem];
          }
        });
        
        // Gọi API thêm vào giỏ hàng
        await axios.put('http://localhost:8080/api/cart/add', cartItem, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Item added to cart successfully, refreshing cart...');
        
        // Sau khi thêm thành công, cập nhật lại giỏ hàng từ server sau một khoảng thời gian nhỏ
        setTimeout(async () => {
          try {
            await fetchCartFromServer();
          } catch (refreshError) {
            console.error('Error refreshing cart after add:', refreshError);
          }
        }, 300);
        
        // Hiển thị thông báo
        showNotification('success', 'Đã thêm sản phẩm vào giỏ hàng!');
      } catch (error) {
        console.error('Error adding item to cart:', error);
        
        // Xử lý lỗi HTTP 405 Method Not Allowed
        if (error.response && error.response.status === 405) {
          try {
            console.log('Method not allowed, trying alternative endpoint...');
            
            const cartItem = {
              productId: product.id,
              quantity: quantity,
              size: size,
              color: color || product.color
            };
            
            // Thử với endpoint khác
            await axios.post('http://localhost:8080/api/cart', cartItem, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('Alternative endpoint successful, refreshing cart...');
            setTimeout(() => fetchCartFromServer(), 300);
            showNotification('success', 'Đã thêm sản phẩm vào giỏ hàng!');
            return;
          } catch (secondError) {
            console.error('Alternative endpoint also failed:', secondError);
          }
        }
        
        // Hiển thị thông báo lỗi phù hợp
        let errorMessage = 'Không thể thêm sản phẩm vào giỏ hàng.';
        if (error.response) {
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.status === 401) {
            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (error.response.status === 404) {
            errorMessage = 'Không tìm thấy sản phẩm.';
          } else if (error.response.status === 400) {
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
          }
        }
        
        showNotification('error', errorMessage);
      }
    } else {
      // Nếu chưa đăng nhập, xử lý giỏ hàng ở local
      setCartItems(prevItems => {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
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
              id: product.id,
              name: product.title || product.name,
              price: product.sellingPrice || product.price,
              originalPrice: product.price > product.sellingPrice ? product.price : null,
              image: product.images && product.images.length > 0 ? product.images[0] : product.image,
              quantity,
              size,
              color: color || product.color
            }
          ];
        }

        return updatedItems;
      });

      // Hiển thị thông báo
      showNotification('success', 'Đã thêm sản phẩm vào giỏ hàng!');
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (id, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    
    const token = localStorage.getItem('jwt');
    
    // Cập nhật local state ngay lập tức để UI responsive
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    
    // Nếu đã đăng nhập, gọi API cập nhật giỏ hàng
    if (token) {
      try {
        const updateData = {
          productId: id,
          quantity: newQuantity,
          size: size,
          color: color
        };
        
        await axios.put('http://localhost:8080/api/cart/update', updateData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Quantity updated successfully, refreshing cart...');
        
        // Sau khi cập nhật thành công, cập nhật lại giỏ hàng từ server
        setTimeout(async () => {
          try {
            await fetchCartFromServer();
          } catch (refreshError) {
            console.error('Error refreshing cart after update:', refreshError);
          }
        }, 300);
      } catch (error) {
        console.error('Error updating cart item:', error);
        showNotification('error', 'Không thể cập nhật số lượng. Vui lòng thử lại sau.');
        
        // Rollback change if API failed
        await fetchCartFromServer();
      }
    }
  };

  /// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (id, size, color) => {
  const token = localStorage.getItem('jwt');
  
  // Cập nhật UI ngay lập tức
  setCartItems(prevItems =>
    prevItems.filter(item => 
      !(item.id === id && item.size === size && item.color === color)
    )
  );
  
  // Nếu đã đăng nhập, gọi API xóa khỏi giỏ hàng
  if (token) {
    try {
      // Tìm cartItemId trong cart trước khi cập nhật UI
      const cartItem = cartItems.find(
        item => item.id === id && item.size === size && item.color === color
      );

      // Kiểm tra nếu không tìm thấy cartItem hoặc không có cartItemId
      if (!cartItem || !cartItem.id) {
        // Sử dụng API khác với params nếu không có cartItemId
        await axios.delete(`http://localhost:8080/api/cart/remove?productId=${id}&size=${size}&color=${color}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Sử dụng API với cartItemId
        await axios.delete(`http://localhost:8080/api/cart/item/${cartItem.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      console.log('Item removed successfully, refreshing cart...');
      
      // Sau khi xóa thành công, cập nhật lại giỏ hàng từ server
      setTimeout(async () => {
        try {
          await fetchCartFromServer();
        } catch (refreshError) {
          console.error('Error refreshing cart after remove:', refreshError);
        }
      }, 300);
      
      showNotification('info', 'Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      showNotification('error', 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      
      // Rollback change if API failed
      await fetchCartFromServer();
    }
  } else {
    showNotification('info', 'Đã xóa sản phẩm khỏi giỏ hàng');
  }
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

    notification,
    closeNotification,
    fetchCartFromServer,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};