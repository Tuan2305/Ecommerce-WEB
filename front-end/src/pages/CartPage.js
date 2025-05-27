import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, fetchCartFromServer } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Phí vận chuyển mẫu
  const shippingFee = cartItems.length > 0 ? 30000 : 0;
  
  // Tính tổng giá trị giỏ hàng (dùng sellingPrice/price giống backend)
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Tính tổng giá gốc (nếu có originalPrice)
  const calculateOriginalTotal = () => {
    return cartItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + originalPrice * item.quantity;
    }, 0);
  };

  // Tính tiền được giảm từ sản phẩm (chênh lệch giữa giá gốc và giá bán)
  const calculateProductDiscount = () => {
    const originalTotal = calculateOriginalTotal();
    const subtotal = calculateSubtotal();
    return originalTotal - subtotal;
  };

  // Tính tổng tiền cuối cùng
  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee - discount;
  };

  // Tính phần trăm giảm giá tổng thể
  const calculateDiscountPercentage = () => {
    const originalTotal = calculateOriginalTotal();
    if (originalTotal === 0) return 0;
    
    const totalDiscount = calculateProductDiscount() + discount;
    return Math.round((totalDiscount / originalTotal) * 100);
  };
  
  // Fetch cart data from server when component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        await fetchCartFromServer();
        setLoading(false);
      } catch (err) {
        setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    loadCart();
  }, [fetchCartFromServer]);
  
  const applyCoupon = () => {
    // Giả lập kiểm tra mã giảm giá
    if (couponCode.toUpperCase() === 'SALE10') {
      setCouponApplied(true);
      setDiscount(calculateSubtotal() * 0.1);
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const handleProceedToCheckout = () => {
    // Lưu thông tin giỏ hàng vào localStorage để dùng khi thanh toán
    const cartSummary = {
      subtotal: calculateSubtotal(),
      originalTotal: calculateOriginalTotal(),
      productDiscount: calculateProductDiscount(),
      couponDiscount: discount,
      shippingFee: shippingFee,
      total: calculateTotal()
    };
    
    localStorage.setItem('cartSummary', JSON.stringify(cartSummary));
    
    // Kiểm tra đăng nhập trước khi chuyển đến trang thanh toán
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
      return;
    }
    
    // Nếu đã đăng nhập, chuyển đến trang thanh toán
    navigate('/checkout');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          Thử lại
        </button>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <FiShoppingBag className="text-gray-300" size={80} />
          <h2 className="text-2xl font-bold mt-6 mb-2">Giỏ hàng của bạn đang trống!</h2>
          <p className="text-gray-600 mb-6">Hãy khám phá các sản phẩm và thêm vào giỏ hàng</p>
          <Link 
            to="/" 
            className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-secondary transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }
  
  // Tính các giá trị cho hiển thị
  const subtotal = calculateSubtotal();
  const productDiscount = calculateProductDiscount();
  const totalAmount = calculateTotal();
  const discountPercentage = calculateDiscountPercentage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:w-2/3">
          <div className="border rounded-lg overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 bg-gray-50 p-4 font-medium">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Thành tiền</div>
            </div>
            
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="border-t p-4">
                <div className="md:grid md:grid-cols-12 gap-4 items-center">
                  {/* Sản phẩm */}
                  <div className="flex md:col-span-6 mb-4 md:mb-0">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4">
                      <Link to={`/product/${item.id}`} className="font-medium hover:text-primary">
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        <span>Size: {item.size}</span>
                        <span className="mx-2">|</span>
                        <span>Màu: {item.color}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Giá */}
                  <div className="md:col-span-2 flex justify-between md:justify-center mb-2 md:mb-0">
                    <span className="md:hidden font-medium">Đơn giá:</span>
                    <div className="text-right md:text-center">
                      <div className="text-primary font-medium">{item.price.toLocaleString()}đ</div>
                      {item.originalPrice && (
                        <div className="text-gray-400 text-sm line-through">
                          {item.originalPrice.toLocaleString()}đ
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Số lượng */}
                  <div className="md:col-span-2 flex justify-between md:justify-center items-center mb-2 md:mb-0">
                    <span className="md:hidden font-medium">Số lượng:</span>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-l hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateQuantity(item.id, item.size, item.color, val);
                          }
                        }}
                        className="w-10 h-8 border-t border-b border-gray-300 text-center"
                      />
                      <button
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-r hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tổng tiền */}
                  <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                    <span className="md:hidden font-medium">Thành tiền:</span>
                    <div className="flex items-center">
                      <span className="text-primary font-medium">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="ml-3 md:ml-6 p-1 text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Tiếp tục mua sắm */}
          <div className="mt-6 flex justify-between">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary hover:underline"
            >
              <span className="mr-2">&larr;</span>
              Tiếp tục mua sắm
            </Link>
            <button
              onClick={clearCart}
              className="text-red-500 hover:underline"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
        
        {/* Tóm tắt đơn hàng - Cập nhật giao diện giống backend */}
        <div className="lg:w-1/3">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3 mb-6">
              {/* Tổng tiền gốc sản phẩm */}
              <div className="flex justify-between">
                <span>Tạm tính ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm):</span>
                <span className="font-medium">{calculateOriginalTotal().toLocaleString()}đ</span>
              </div>
              
              {/* Giảm giá từ sản phẩm */}
              {productDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá sản phẩm:</span>
                  <span className="font-medium">-{productDiscount.toLocaleString()}đ</span>
                </div>
              )}
              
              {/* Tiền sản phẩm sau giảm giá */}
              <div className="flex justify-between font-medium">
                <span>Tiền hàng:</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              
              {/* Phí vận chuyển */}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-medium">{shippingFee.toLocaleString()}đ</span>
              </div>
              
              {/* Giảm giá từ mã coupon */}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Mã giảm giá:</span>
                  <span className="font-medium">-{discount.toLocaleString()}đ</span>
                </div>
              )}
              
              {/* Hiển thị % giảm giá tổng hợp nếu có */}
              {discountPercentage > 0 && (
                <div className="flex justify-between bg-yellow-50 p-2 rounded-md text-yellow-700">
                  <span>Tiết kiệm:</span>
                  <span className="font-medium">{discountPercentage}%</span>
                </div>
              )}
              
              {/* Tổng cộng */}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Tổng thanh toán:</span>
                <span className="text-lg text-primary">{totalAmount.toLocaleString()}đ</span>
              </div>
            </div>
            
            {/* Mã giảm giá */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none"
                  disabled={couponApplied}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponApplied || !couponCode}
                  className={`px-4 py-2 rounded-r font-medium ${
                    couponApplied
                      ? 'bg-gray-300 text-gray-600'
                      : 'bg-primary text-white hover:bg-secondary'
                  }`}
                >
                  Áp dụng
                </button>
              </div>
              {couponApplied && (
                <div className="text-sm text-green-600">
                  Mã giảm giá đã được áp dụng thành công!
                </div>
              )}
            </div>
            
            {/* Thanh toán */}
            <button 
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition flex justify-center items-center"
            >
              Tiến hành thanh toán
            </button>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Bằng cách đặt hàng, bạn đồng ý với
              <Link to="/terms" className="text-primary hover:underline mx-1">
                Điều khoản sử dụng
              </Link>
              và
              <Link to="/privacy" className="text-primary hover:underline ml-1">
                Chính sách bảo mật
              </Link>
              của FashionStore
            </div>
          </div>
          
          {/* Phương thức thanh toán */}
          <div className="border rounded-lg p-6 mt-4">
            <h3 className="font-medium mb-3">Chúng tôi chấp nhận</h3>
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-8 flex items-center justify-center border rounded">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              </div>
              <div className="w-12 h-8 flex items-center justify-center border rounded">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              </div>
              <div className="w-12 h-8 flex items-center justify-center border rounded">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Stripe_logo%2C_revised_2016.png" alt="Stripe" className="h-4" />
              </div>
              <div className="w-12 h-8 flex items-center justify-center border rounded">
                <span className="text-xs font-medium">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;