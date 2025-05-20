import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  // Phí vận chuyển mẫu
  const shippingFee = cartItems.length > 0 ? 30000 : 0;
  
  const applyCoupon = () => {
    // Giả lập kiểm tra mã giảm giá
    if (couponCode.toUpperCase() === 'SALE10') {
      setCouponApplied(true);
      setDiscount(cartTotal * 0.1);
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };
  
  const calculateTotal = () => {
    return cartTotal + shippingFee - discount;
  };
  
  // Đây là vấn đề chính - phải sử dụng cartTotal từ context
  const calculateSubtotal = () => {
    return cartTotal;
  };
  
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
        
        {/* Tóm tắt đơn hàng */}
        <div className="lg:w-1/3">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                <span className="font-medium">{calculateSubtotal().toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-medium">{shippingFee.toLocaleString()}đ</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span className="font-medium">-{discount.toLocaleString()}đ</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Tổng cộng:</span>
                <span className="text-lg text-primary">{calculateTotal().toLocaleString()}đ</span>
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
            <button className="w-full py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition">
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
              <div className="w-12 h-8 bg-gray-100 rounded"></div>
              <div className="w-12 h-8 bg-gray-100 rounded"></div>
              <div className="w-12 h-8 bg-gray-100 rounded"></div>
              <div className="w-12 h-8 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;