import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiClock, FiInfo, FiArrowLeft, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
import axios from 'axios';

const PaymentSuccessPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy orderId từ URL query params
  // const orderId = new URLSearchParams(location.search).get('orderId');
  const orderId = localStorage.getItem('orderId');
  
  useEffect(() => {
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng'); 
      setLoading(false);
      return;
    }

    
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          navigate('/login', { state: { redirectTo: location.pathname + location.search } });
          return;
        }
        
        const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thông tin đơn hàng:', error);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, navigate, location]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <FiInfo className="text-red-500 mx-auto text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <FiInfo className="text-yellow-500 mx-auto text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 mb-6">Không thể tìm thấy thông tin đơn hàng với mã {orderId}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }
  
  // Lấy thông tin đơn hàng
  const { 
    id, 
    orderItems, 
    totalPrice, 
    shippingAddress, 
    orderStatus, 
    orderDate, 
    deliverDate, 
    paymentDetails,
    stripeDetails
  } = order;
  
  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-6 flex items-center border-b">
          <FiCheckCircle className="text-green-500 text-3xl mr-4" />
          <div>
            <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận.
            </p>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Thông tin đơn hàng</h2>
            <span className="font-medium text-primary">Mã đơn hàng: #{orderId}</span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <FiClock className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Thời gian đặt hàng: {formatDate(orderDate)}</p>
                <p className="text-sm text-gray-500">Dự kiến giao hàng: {formatDate(deliverDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                orderStatus === 'PENDING' ? 'bg-yellow-500' : 
                orderStatus === 'CONFIRMED' ? 'bg-blue-500' :
                orderStatus === 'SHIPPED' ? 'bg-blue-600' :
                orderStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <p className="text-sm font-medium">
                Trạng thái: {
                  orderStatus === 'PENDING' ? 'Chờ xác nhận' :
                  orderStatus === 'CONFIRMED' ? 'Đã xác nhận' :
                  orderStatus === 'SHIPPED' ? 'Đang giao hàng' :
                  orderStatus === 'DELIVERED' ? 'Đã giao hàng' :
                  orderStatus
                }
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <FiMapPin className="mr-2 text-gray-500" />
                Địa chỉ giao hàng
              </h3>
              
              {shippingAddress && (
                <div className="text-gray-600">
                  <p className="font-medium">{shippingAddress.name}</p>
                  <p className="flex items-start mt-1">
                    <FiPhone className="mr-2 mt-1 flex-shrink-0" />
                    <span>{shippingAddress.mobile}</span>
                  </p>
                  <p className="flex items-start mt-1">
                    <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                    <span>{shippingAddress.address}, {shippingAddress.city}</span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Payment Info */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Thông tin thanh toán</h3>
              
              <div className="text-gray-600">
                <p className="mb-1">Phương thức: <span className="font-medium">
                  {paymentDetails?.paymentMethod === 'STRIPE' ? 'Thẻ tín dụng (Stripe)' : 'Thanh toán khi nhận hàng (COD)'}
                </span></p>
                
                <p className="mb-1">Trạng thái: <span className={`font-medium ${
                  (paymentDetails?.paymentStatus === 'PAID' || stripeDetails?.paymentStatus === 'paid') 
                    ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {(paymentDetails?.paymentStatus === 'PAID' || stripeDetails?.paymentStatus === 'paid') 
                    ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span></p>
                
                {stripeDetails?.sessionId && (
                  <p className="mb-1 text-sm">Mã giao dịch: {stripeDetails.sessionId}</p>
                )}
                
                <p className="mt-2 font-medium text-lg">
                  Tổng cộng: <span className="text-primary">{totalPrice?.toLocaleString()}đ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white p-6 shadow-sm mb-6 rounded-b-lg">
          <h2 className="text-xl font-bold mb-4">Sản phẩm đã mua</h2>
          
          <div className="divide-y">
            {orderItems?.map((item) => (
              <div key={item.id} className="py-4 flex">
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.title} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.product.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>Size: {item.size}</span>
                    <span className="mx-1">|</span>
                    <span>Màu: {item.product.color}</span>
                    <span className="mx-1">|</span>
                    <span>SL: {item.quantity}</span>
                  </div>
                  <div className="text-primary text-sm mt-1">
                    {item.sellingPrice.toLocaleString()}đ
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tổng tiền hàng:</span>
              <span>{(totalPrice || 0).toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span>0đ</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Thành tiền:</span>
              <span className="text-primary">{(totalPrice || 0).toLocaleString()}đ</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap justify-center mt-8 space-x-0 space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/" className="w-full md:w-auto px-6 py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition text-center">
            Tiếp tục mua sắm
          </Link>
          <Link to="/orders" className="w-full md:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition text-center">
            Xem đơn hàng của tôi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;