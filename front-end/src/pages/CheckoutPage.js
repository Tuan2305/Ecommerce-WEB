import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiChevronRight, FiCreditCard, FiCheck, FiLock, FiPlus, FiTrash2, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Thông tin vận chuyển, 2: Thanh toán, 3: Xác nhận
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressError, setNewAddressError] = useState('');
  const [stripeError, setStripeError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('STRIPE'); // STRIPE hoặc COD
  const [orderNote, setOrderNote] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Phí vận chuyển và tính tổng
  const shippingFee = 30000;
  const discount = 0;
  
  const total = cartTotal + shippingFee - discount;
  
  // Kiểm tra nếu người dùng quay lại từ trang thanh toán Stripe
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get('status');
    const returnedOrderId = query.get('orderId');
    
    if (status === 'success' && returnedOrderId) {
      // Nếu thanh toán thành công và có orderId
      setOrderId(returnedOrderId);
      setStep(3); // Chuyển đến bước xác nhận
      clearCart(); // Xóa giỏ hàng
    } else if (status === 'cancel' && returnedOrderId) {
      // Nếu thanh toán bị hủy
      alert('Thanh toán đã bị hủy. Vui lòng thử lại sau.');
    }
  }, [location, clearCart]);
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('Vui lòng đăng nhập để thanh toán');
      navigate('/login', { state: { redirectTo: '/checkout' } });
    } else {
      fetchAddresses();
    }
  }, [navigate]);
  
  // Fetch user addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get('http://localhost:8080/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSavedAddresses(response.data);
      
      // Chọn địa chỉ mặc định nếu có
      const defaultAddress = response.data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (response.data.length > 0) {
        // Nếu không có địa chỉ mặc định, chọn địa chỉ đầu tiên
        setSelectedAddress(response.data[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
      setLoading(false);
    }
  };
  
  // Thêm địa chỉ mới
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNewAddressError('');
    
    // Kiểm tra thông tin nhập vào
    if (!shippingInfo.name || !shippingInfo.mobile || !shippingInfo.address || !shippingInfo.city) {
      setNewAddressError('Vui lòng điền đầy đủ thông tin địa chỉ');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post('http://localhost:8080/api/addresses', shippingInfo, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch lại danh sách địa chỉ
      await fetchAddresses();
      
      // Chọn địa chỉ vừa thêm
      setSelectedAddress(response.data);
      
      // Reset form
      setShippingInfo({
        name: '',
        mobile: '',
        address: '',
        city: ''
      });
      
      // Đóng form thêm địa chỉ
      setIsAddingAddress(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      setNewAddressError('Đã xảy ra lỗi khi thêm địa chỉ. Vui lòng thử lại sau.');
      setIsSubmitting(false);
    }
  };
  
  // Xóa địa chỉ
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('jwt');
      await axios.delete(`http://localhost:8080/api/addresses/${addressId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (selectedAddress && selectedAddress.id === addressId) {
        setSelectedAddress(null);
      }
      
      // Fetch lại danh sách địa chỉ
      await fetchAddresses();
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      alert('Đã xảy ra lỗi khi xóa địa chỉ');
    }
  };

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateShippingInfo = () => {
    const newErrors = {};
    
    if (!selectedAddress && !isAddingAddress) {
      if (savedAddresses.length === 0) {
        setIsAddingAddress(true);
        newErrors.address = 'Vui lòng thêm địa chỉ mới';
      } else {
        newErrors.address = 'Vui lòng chọn một địa chỉ';
      }
    }
    
    if (isAddingAddress) {
      if (!shippingInfo.name.trim()) {
        newErrors.name = 'Vui lòng nhập họ tên';
      }
      
      if (!shippingInfo.mobile.trim()) {
        newErrors.mobile = 'Vui lòng nhập số điện thoại';
      } else if (!/^[0-9]{10}$/.test(shippingInfo.mobile.trim())) {
        newErrors.mobile = 'Số điện thoại không hợp lệ';
      }
      
      if (!shippingInfo.address.trim()) {
        newErrors.address = 'Vui lòng nhập địa chỉ';
      }
      
      if (!shippingInfo.city.trim()) {
        newErrors.city = 'Vui lòng nhập thành phố';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1) {
      if (validateShippingInfo()) {
        setStep(2);
        window.scrollTo(0, 0);
      }
    } else if (step === 2) {
      handleSubmitOrder();
    }
  };

  const handleSubmitOrder = async () => {
  setIsSubmitting(true);
  setStripeError('');
  
  try {
    // Lấy thông tin giỏ hàng từ localStorage hoặc tính toán lại
    let cartSummary = null;
    try {
      const savedSummary = localStorage.getItem('cartSummary');
      if (savedSummary) {
        cartSummary = JSON.parse(savedSummary);
      }
    } catch (e) {
      console.error('Error parsing cart summary', e);
    }
    
    // Nếu không có cartSummary, tính toán lại
    if (!cartSummary) {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingFee = cartItems.length > 0 ? 30000 : 0;
      
      cartSummary = {
        subtotal: subtotal,
        shippingFee: shippingFee,
        total: subtotal + shippingFee
      };
    }
    
    // Chuẩn bị dữ liệu đơn hàng gửi đến backend
    const orderData = {
      shippingAddress: selectedAddress,
      paymentMethod: paymentMethod,
      total: cartSummary.total, // Tổng tiền thanh toán
      subtotal: cartSummary.subtotal, // Tiền hàng
      shippingFee: cartSummary.shippingFee, // Phí vận chuyển
      discount: cartSummary.couponDiscount || 0, // Giảm giá từ mã giảm giá
      discountPercentage: cartSummary.discountPercentage || 0, // Phần trăm giảm giá
      note: orderNote || '',
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
    
    console.log('Sending order data to backend:', orderData);
    
    // Gọi API tạo đơn hàng
    const token = localStorage.getItem('jwt');
    const response = await axios.post('http://localhost:8080/api/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Order created successfully:', response.data);

    // Xử lý response từ server
    const receivedOrderId = response.data.orderId || response.data.id;
    const paymentUrl = response.data.payment_link_url;
    
    setOrderId(receivedOrderId);
    localStorage.setItem('orderId', receivedOrderId);
    
    // Xử lý phương thức thanh toán
    if (paymentMethod === 'STRIPE' && paymentUrl) {
      window.location.href = paymentUrl;
    } else if (paymentMethod === 'COD') {
      setStep(3);
      clearCart(); // Xóa giỏ hàng sau khi đặt hàng COD thành công
    } else if (paymentMethod === 'STRIPE' && !paymentUrl) {
      // Xử lý trường hợp không có URL thanh toán Stripe
      try {
        const stripeLinkResponse = await axios.get(`http://localhost:8080/api/payment/stripe-checkout?orderId=${receivedOrderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (stripeLinkResponse.data && stripeLinkResponse.data.url) {
          window.location.href = stripeLinkResponse.data.url;
        } else {
          throw new Error('Không nhận được URL thanh toán');
        }
      } catch (stripeError) {
        console.error('Lỗi khi lấy URL thanh toán Stripe:', stripeError);
        setStripeError('Không thể khởi tạo thanh toán Stripe. Vui lòng thử lại sau hoặc chọn phương thức thanh toán khác.');
        setIsSubmitting(false);
      }
    }
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    setStripeError(error.response?.data?.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.');
    setIsSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/" className="text-gray-500 hover:text-primary">
          Trang chủ
        </Link>
        <FiChevronRight className="mx-2 text-gray-500" />
        <Link to="/cart" className="text-gray-500 hover:text-primary">
          Giỏ hàng
        </Link>
        <FiChevronRight className="mx-2 text-gray-500" />
        <span className="font-medium">Thanh toán</span>
      </div>
      
      {/* Tiến trình thanh toán */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="mt-2 text-sm">Địa chỉ</span>
          </div>
          <div className={`w-16 md:w-32 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="mt-2 text-sm">Thanh toán</span>
          </div>
          <div className={`w-16 md:w-32 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="mt-2 text-sm">Hoàn tất</span>
          </div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phần thông tin địa chỉ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b p-4">
                <h2 className="text-lg font-bold">Địa chỉ nhận hàng</h2>
              </div>
              
              {/* Nút thêm địa chỉ mới */}
              {!isAddingAddress && (
                <div className="p-4 border-b">
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center text-primary hover:underline"
                  >
                    <FiPlus className="mr-2" /> Thêm địa chỉ mới
                  </button>
                </div>
              )}
              
              {/* Danh sách địa chỉ đã lưu */}
              {savedAddresses.length > 0 && !isAddingAddress && (
                <div className="p-4">
                  <div className="space-y-4">
                    {savedAddresses.map((address) => (
                      <div key={address.id} className={`border rounded-md p-4 ${selectedAddress && selectedAddress.id === address.id ? 'border-primary bg-orange-50' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`address-${address.id}`}
                              name="selectedAddress"
                              checked={selectedAddress && selectedAddress.id === address.id}
                              onChange={() => setSelectedAddress(address)}
                              className="mr-3 h-4 w-4 text-primary"
                            />
                            <label htmlFor={`address-${address.id}`} className="flex-1">
                              <span className="font-medium">{address.name}</span>
                              <span className="mx-2 text-gray-400">|</span>
                              <span>{address.mobile}</span>
                            </label>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                        
                        <div className="ml-7">
                          <div className="text-gray-600">
                            {address.address}, {address.city}
                          </div>
                          
                          {address.isDefault && (
                            <span className="text-xs text-primary border border-primary px-1 rounded mt-1 inline-block">
                              Mặc định
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Form thêm địa chỉ mới */}
              {isAddingAddress && (
                <div className="p-4">
                  <h3 className="font-medium mb-4">Thêm địa chỉ mới</h3>
                  <form onSubmit={handleAddAddress}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={shippingInfo.name}
                          onChange={(e) => handleInputChange(e, setShippingInfo)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Nhập họ tên"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={shippingInfo.mobile}
                          onChange={(e) => handleInputChange(e, setShippingInfo)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Nhập số điện thoại"
                        />
                        {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={shippingInfo.address}
                          onChange={(e) => handleInputChange(e, setShippingInfo)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={(e) => handleInputChange(e, setShippingInfo)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Nhập tỉnh/thành phố"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                    </div>
                    
                    {newAddressError && <p className="text-red-500 text-sm mt-4">{newAddressError}</p>}
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        onClick={() => setIsAddingAddress(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Thông báo khi không có địa chỉ nào */}
              {savedAddresses.length === 0 && !isAddingAddress && (
                <div className="p-4 text-center py-6">
                  <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                  >
                    Thêm địa chỉ mới
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b p-4">
                <h2 className="text-lg font-bold">Ghi chú</h2>
              </div>
              <div className="p-4">
                <textarea
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Thông tin đơn hàng */}
          <div>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b p-4">
                <h2 className="text-lg font-bold">Đơn hàng của bạn</h2>
              </div>
              
              <div className="p-4 divide-y">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="py-3 flex">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="font-medium line-clamp-2">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span>Size: {item.size}</span>
                        <span className="mx-1">|</span>
                        <span>Màu: {item.color}</span>
                        <span className="mx-1">|</span>
                        <span>x{item.quantity}</span>
                      </div>
                      <div className="text-primary text-sm mt-1">
                        {item.price.toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{cartTotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{shippingFee.toLocaleString()}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{total.toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <div className="mb-4">
                <h3 className="font-bold mb-3">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="STRIPE"
                      checked={paymentMethod === 'STRIPE'}
                      onChange={() => setPaymentMethod('STRIPE')}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      <FiCreditCard className="mr-2 text-primary" />
                      <span>Thanh toán qua thẻ (Stripe)</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      <FiCheck className="mr-2 text-primary" />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <button
                onClick={handleContinue}
                disabled={!selectedAddress && !isAddingAddress}
                className={`w-full py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition flex justify-center items-center ${
                  (!selectedAddress && !isAddingAddress) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                Tiếp tục
              </button>
              
              {(!selectedAddress && !isAddingAddress && savedAddresses.length > 0) && (
                <p className="text-red-500 text-xs mt-2 text-center">Vui lòng chọn một địa chỉ trước khi tiếp tục</p>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b p-4">
                <h2 className="text-lg font-bold">Xác nhận thanh toán</h2>
              </div>
              
              <div className="p-6">
                <div className="border p-4 rounded-lg bg-gray-50 mb-6 flex items-center">
                  <FiLock className="mr-3 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Thông tin thanh toán của bạn sẽ được bảo mật</p>
                    <p className="text-gray-600">
                      {paymentMethod === 'STRIPE' 
                        ? 'Bạn sẽ được chuyển đến trang thanh toán an toàn của Stripe sau khi xác nhận.' 
                        : 'Bạn sẽ thanh toán khi nhận được hàng.'}
                    </p>
                  </div>
                </div>
                
                {/* Thông tin địa chỉ đã chọn */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Địa chỉ giao hàng</h3>
                  {selectedAddress && (
                    <div className="border rounded p-4">
                      <div className="flex items-start mb-2">
                        <FiUser className="mt-1 mr-2 text-gray-500" />
                        <div className="font-medium">{selectedAddress.name}</div>
                      </div>
                      <div className="flex items-start mb-2">
                        <FiPhone className="mt-1 mr-2 text-gray-500" />
                        <div>{selectedAddress.mobile}</div>
                      </div>
                      <div className="flex items-start">
                        <FiMapPin className="mt-1 mr-2 text-gray-500" />
                        <div>{selectedAddress.address}, {selectedAddress.city}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Thông tin phương thức thanh toán */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Phương thức thanh toán</h3>
                  <div className="border rounded p-4">
                    <div className="flex items-center">
                      {paymentMethod === 'STRIPE' ? (
                        <>
                          <FiCreditCard className="mr-2 text-primary" />
                          <span>Thanh toán qua thẻ (Stripe)</span>
                        </>
                      ) : (
                        <>
                          <FiCheck className="mr-2 text-primary" />
                          <span>Thanh toán khi nhận hàng (COD)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'STRIPE' && (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                    <div className="flex space-x-2 mb-4">
                      <div className="border rounded p-1 w-12 h-8 flex items-center justify-center">
                        <img src="https://brandlogos.net/wp-content/uploads/2021/11/visa-logo.png" alt="Visa" className="h-5" />
                      </div>
                      <div className="border rounded p-1 w-12 h-8 flex items-center justify-center">
                        <img src="https://brandlogos.net/wp-content/uploads/2013/07/mastercard-logo-vector.svg" alt="MasterCard" className="h-5" />
                      </div>
                      <div className="border rounded p-1 w-12 h-8 flex items-center justify-center">
                        <img src="https://cdn.freebiesupply.com/logos/large/2x/jcb-logo-png-transparent.png" alt="JCB" className="h-5" />
                      </div>
                    </div>
                  </div>
                )}
                
                {stripeError && (
                  <div className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded">
                    {stripeError}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Thông tin đơn hàng */}
          <div>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b p-4">
                <h2 className="text-lg font-bold">Tóm tắt đơn hàng</h2>
              </div>
              
              <div className="p-4 divide-y">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Số lượng:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{cartTotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{shippingFee.toLocaleString()}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{total.toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className={`w-full py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition flex justify-center items-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-3"></div>
                    Đang xử lý...
                  </>
                ) : (
                  paymentMethod === 'STRIPE' ? 'Thanh toán qua Stripe' : 'Đặt hàng (COD)'
                )}
              </button>

              <div className="flex items-center justify-center mt-4">
                <FiLock className="text-gray-500 mr-2" size={14} />
                <span className="text-xs text-gray-500">Thanh toán an toàn và bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <FiCheck className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Đặt hàng thành công!</h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="font-medium">Đơn hàng #{orderId}</p>
            <p className="text-sm text-gray-500">Chúng tôi đã gửi email xác nhận đơn hàng cùng với thông tin chi tiết.</p>
          </div>
          <div className="space-x-4">
            <Link to="/orders" className="px-6 py-3 bg-primary text-white font-medium rounded hover:bg-secondary transition">
              Xem đơn hàng
            </Link>
            <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;