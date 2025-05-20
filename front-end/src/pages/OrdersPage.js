import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiSearch, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load mock orders data
    const mockOrders = [
      {
        id: 'DH12345678',
        date: '20/06/2023',
        status: 'completed',
        total: 780000,
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
            price: 480000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        id: 'DH12345679',
        date: '15/06/2023',
        status: 'shipping',
        total: 350000,
        items: [
          {
            id: 3,
            name: 'Đầm xòe cổ V nữ tính',
            variation: 'Hồng, Size M',
            price: 350000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        id: 'DH12345680',
        date: '10/06/2023',
        status: 'processing',
        total: 280000,
        items: [
          {
            id: 4,
            name: 'Áo sơ mi nam tay dài',
            variation: 'Trắng, Size XL',
            price: 280000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        id: 'DH12345681',
        date: '05/06/2023',
        status: 'cancelled',
        total: 550000,
        items: [
          {
            id: 6,
            name: 'Áo khoác denim unisex',
            variation: 'Xanh nhạt, Size L',
            price: 550000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        id: 'DH12345682',
        date: '01/06/2023',
        status: 'completed',
        total: 660000,
        items: [
          {
            id: 7,
            name: 'Quần short khaki nam',
            variation: 'Nâu, Size 30',
            price: 220000,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on the active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === activeTab));
    }
  }, [activeTab, orders]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If no search query, show filtered by tab
      if (activeTab === 'all') {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(orders.filter((order) => order.status === activeTab));
      }
    } else {
      // Search within the current tab filter
      let tabFiltered = orders;
      if (activeTab !== 'all') {
        tabFiltered = orders.filter((order) => order.status === activeTab);
      }

      // Then search by order ID or product name
      setFilteredOrders(
        tabFiltered.filter(
          (order) =>
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }
  }, [searchQuery, activeTab, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiClock className="text-primary" size={20} />;
      case 'shipping':
        return <FiTruck className="text-blue-500" size={20} />;
      case 'completed':
        return <FiCheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" size={20} />;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-gray-500 hover:text-primary">
          Trang chủ
        </Link>
        <FiChevronRight className="mx-2 text-gray-500" />
        <span className="font-medium">Đơn hàng của tôi</span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'processing' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('processing')}
          >
            Chờ xác nhận
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'shipping' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            Đang giao
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Đã giao
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'cancelled' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Đã hủy
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm"
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Orders list */}
        <div className="divide-y">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="p-4">
                {/* Order header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className={`ml-2 font-medium ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Mã đơn hàng: <span className="font-medium">{order.id}</span> | Ngày đặt:{' '}
                    <span className="font-medium">{order.date}</span>
                  </div>
                </div>

                {/* Order items */}
                <div className="border-t border-b py-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex py-2">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="ml-3 flex-grow">
                        <Link to={`/product/${item.id}`} className="font-medium hover:text-primary">
                          {item.name}
                        </Link>
                        <div className="text-sm text-gray-500">Phân loại: {item.variation}</div>
                        <div className="flex justify-between mt-1">
                          <div className="text-gray-500">x{item.quantity}</div>
                          <div className="font-medium">{item.price.toLocaleString()}đ</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div className="flex justify-between items-center pt-3">
                  <div className="text-primary">
                    {order.items.reduce((total, item) => total + item.quantity, 0)} sản phẩm
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="text-gray-500 mr-2">Thành tiền:</span>
                      <span className="text-xl font-bold text-primary">{order.total.toLocaleString()}đ</span>
                    </div>
                    <div className="mt-2 flex space-x-2 justify-end">
                      <Link
                        to={`/order/${order.id}`}
                        className="px-4 py-1 border border-primary text-primary rounded hover:bg-orange-50"
                      >
                        Xem chi tiết
                      </Link>
                      {order.status === 'completed' && (
                        <button className="px-4 py-1 bg-primary text-white rounded hover:bg-secondary">
                          Mua lại
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button className="px-4 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-100">
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <FiPackage className="mx-auto text-gray-300" size={60} />
              <p className="mt-4 text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;