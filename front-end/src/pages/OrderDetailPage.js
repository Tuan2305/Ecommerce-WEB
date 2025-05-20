import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronRight, FiPackage, FiTruck, FiCheckCircle, FiMapPin, FiUser, FiPhone, FiClock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch order details from an API
    // Here we simulate an API call with a timeout
    setLoading(true);
    const timer = setTimeout(() => {
      // Mock order data
      const mockOrder = {
        id: id || 'DH12345678',
        date: '20/06/2023',
        status: 'completed',
        total: 780000,
        subtotal: 630000,
        shipping: 30000,
        discount: 0,
        paymentMethod: 'COD - Thanh toán khi nhận hàng',
        trackingNumber: 'TK123456789VN',
        shippingAddress: {
          name: 'Nguyễn Văn A',
          phone: '0912345678',
          address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP Hồ Chí Minh',
        },
        timeline: [
          {
            status: 'created',
            date: '20/06/2023 08:30',
            description: 'Đơn hàng đã được tạo',
          },
          {
            status: 'confirmed',
            date: '20/06/2023 09:15',
            description: 'Đơn hàng đã được xác nhận',
          },
          {
            status: 'packed',
            date: '20/06/2023 14:20',
            description: 'Đơn hàng đã được đóng gói',
          },
          {
            status: 'shipped',
            date: '21/06/2023 10:45',
            description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
          },
          {
            status: 'delivered',
            date: '23/06/2023 15:30',
            description: 'Đơn hàng đã được giao thành công',
          },
        ],
        items: [
          {
            id: 1,
            name: 'Áo thun unisex form rộng',
            variation: 'Trắng, Size L',
            price: 150000,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          },
          {
            id: 2,
            name: 'Quần jean nam ống rộng',
            variation: 'Xanh đậm, Size 32',
            price: 330000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          },
        ],
      };

      setOrderData(mockOrder);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiClock className="text-primary" size={20} />;
      case 'shipping':
        return <FiTruck className="text-blue-500" size={20} />;
      case 'completed':
        return <FiCheckCircle className="text-green-500" size={20} />;
      default:
        return <FiPackage className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'processing':
        return 'text-primary';
      case 'shipping':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">Vui lòng đăng nhập để xem đơn hàng</h2>
        <Link to="/login" className="inline-block px-4 py-2 bg-primary text-white rounded">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">Không tìm thấy thông tin đơn hàng</h2>
        <Link to="/orders" className="inline-block px-4 py-2 bg-primary text-white rounded">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-gray-500 hover:text-primary">
          Trang chủ
        </Link>
        <FiChevronRight className="mx-2 text-gray-500" />
        <Link to="/orders" className="text-gray-500 hover:text-primary">
          Đơn hàng của tôi
        </Link>
        <FiChevronRight className="mx-2 text-gray-500" />
        <span className="font-medium">Chi tiết đơn hàng {orderData.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2">
          {/* Status */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Trạng thái đơn hàng</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                {getStatusIcon(orderData.status)}
                <span className={`ml-2 font-medium ${getStatusClass(orderData.status)}`}>
                  {getStatusText(orderData.status)}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative ml-2 pl-6 border-l-2 border-dashed border-gray-200">
                {orderData.timeline.map((event, index) => (
                  <div key={index} className="mb-6 relative">
                    <div
                      className={`w-4 h-4 rounded-full absolute -left-8 top-0 transform -translate-x-1/2 ${
                        index === orderData.timeline.length - 1
                          ? 'bg-green-500'
                          : index === 0
                          ? 'bg-primary'
                          : 'bg-blue-500'
                      }`}
                    ></div>
                    <div className="text-sm text-gray-500">{event.date}</div>
                    <div className="font-medium">{event.description}</div>
                  </div>
                ))}
              </div>

              {orderData.trackingNumber && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Mã vận đơn:</div>
                  <div className="font-medium">{orderData.trackingNumber}</div>
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Sản phẩm đã mua</h2>
            </div>
            <div className="divide-y">
              {orderData.items.map((item) => (
                <div key={item.id} className="p-4 flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <Link to={`/product/${item.id}`} className="font-medium hover:text-primary">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">Phân loại: {item.variation}</div>
                    <div className="flex justify-between mt-2">
                      <div className="text-gray-500">x{item.quantity}</div>
                      <div className="font-medium">{item.price.toLocaleString()}đ</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <button className="w-full py-2 text-primary border border-primary rounded hover:bg-orange-50">
                Mua lại
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          {/* Shipping address */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Địa chỉ nhận hàng</h2>
            </div>
            <div className="p-4">
              <div className="flex items-start mb-2">
                <FiUser className="mt-1 mr-2 text-gray-500" />
                <div className="font-medium">{orderData.shippingAddress.name}</div>
              </div>
              <div className="flex items-start mb-2">
                <FiPhone className="mt-1 mr-2 text-gray-500" />
                <div>{orderData.shippingAddress.phone}</div>
              </div>
              <div className="flex items-start">
                <FiMapPin className="mt-1 mr-2 text-gray-500" />
                <div>{orderData.shippingAddress.address}</div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Thông tin đơn hàng</h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Mã đơn hàng:</div>
                <div className="font-medium">{orderData.id}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Ngày đặt hàng:</div>
                <div className="font-medium">{orderData.date}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Phương thức thanh toán:</div>
                <div className="font-medium">{orderData.paymentMethod}</div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <div className="text-gray-500">Tạm tính:</div>
                  <div className="font-medium">{orderData.subtotal.toLocaleString()}đ</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-gray-500">Phí vận chuyển:</div>
                  <div className="font-medium">{orderData.shipping.toLocaleString()}đ</div>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <div>Giảm giá:</div>
                    <div className="font-medium">-{orderData.discount.toLocaleString()}đ</div>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t mt-2">
                  <div className="font-bold">Tổng cộng:</div>
                  <div className="font-bold text-primary text-lg">{orderData.total.toLocaleString()}đ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;