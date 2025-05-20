import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiCalendar, FiSearch, FiFilter, FiCheck, FiX, FiTruck, FiPackage } from 'react-icons/fi';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    // Fetch orders data
    const fetchOrders = async () => {
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data for orders
          const mockOrders = [
            {
              id: 'DH00001',
              customerName: 'Nguyễn Văn A',
              email: 'nguyenvana@example.com',
              phone: '0901234567',
              total: 850000,
              status: 'completed',
              items: 3,
              date: '2023-05-15T08:30:00',
              paymentMethod: 'COD'
            },
            {
              id: 'DH00002',
              customerName: 'Trần Thị B',
              email: 'tranthib@example.com',
              phone: '0912345678',
              total: 450000,
              status: 'shipping',
              items: 2,
              date: '2023-05-14T14:45:00',
              paymentMethod: 'Banking'
            },
            {
              id: 'DH00003',
              customerName: 'Lê Văn C',
              email: 'levanc@example.com',
              phone: '0923456789',
              total: 1250000,
              status: 'processing',
              items: 5,
              date: '2023-05-14T10:15:00',
              paymentMethod: 'COD'
            },
            {
              id: 'DH00004',
              customerName: 'Phạm Thị D',
              email: 'phamthid@example.com',
              phone: '0934567890',
              total: 350000,
              status: 'cancelled',
              items: 1,
              date: '2023-05-13T16:20:00',
              paymentMethod: 'Banking'
            },
            {
              id: 'DH00005',
              customerName: 'Hoàng Văn E',
              email: 'hoangvane@example.com',
              phone: '0945678901',
              total: 750000,
              status: 'completed',
              items: 3,
              date: '2023-05-12T09:10:00',
              paymentMethod: 'COD'
            },
            {
              id: 'DH00006',
              customerName: 'Vũ Thị F',
              email: 'vuthif@example.com',
              phone: '0956789012',
              total: 550000,
              status: 'processing',
              items: 2,
              date: '2023-05-11T11:30:00',
              paymentMethod: 'Banking'
            },
            {
              id: 'DH00007',
              customerName: 'Đặng Văn G',
              email: 'dangvang@example.com',
              phone: '0967890123',
              total: 950000,
              status: 'shipping',
              items: 4,
              date: '2023-05-10T15:45:00',
              paymentMethod: 'COD'
            },
            {
              id: 'DH00008',
              customerName: 'Bùi Thị H',
              email: 'buithih@example.com',
              phone: '0978901234',
              total: 450000,
              status: 'completed',
              items: 2,
              date: '2023-05-09T13:20:00',
              paymentMethod: 'Banking'
            },
            {
              id: 'DH00009',
              customerName: 'Ngô Văn I',
              email: 'ngovani@example.com',
              phone: '0989012345',
              total: 650000,
              status: 'cancelled',
              items: 3,
              date: '2023-05-08T10:10:00',
              paymentMethod: 'COD'
            },
            {
              id: 'DH00010',
              customerName: 'Dương Thị K',
              email: 'duongthik@example.com',
              phone: '0990123456',
              total: 850000,
              status: 'processing',
              items: 3,
              date: '2023-05-07T16:55:00',
              paymentMethod: 'Banking'
            },
            {
              id: 'DH00011',
              customerName: 'Lý Văn L',
              email: 'lyvanl@example.com',
              phone: '0901234567',
              total: 1150000,
              status: 'shipping',
              items: 6,
              date: '2023-05-06T09:30:00',
              paymentMethod: 'COD'
            },
            {
              id: 'DH00012',
              customerName: 'Trịnh Thị M',
              email: 'trinhthim@example.com',
              phone: '0912345678',
              total: 350000,
              status: 'completed',
              items: 1,
              date: '2023-05-05T14:15:00',
              paymentMethod: 'Banking'
            }
          ];
          
          setOrders(mockOrders);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipping':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiPackage className="text-yellow-500" />;
      case 'shipping':
        return <FiTruck className="text-blue-500" />;
      case 'completed':
        return <FiCheck className="text-green-500" />;
      case 'cancelled':
        return <FiX className="text-red-500" />;
      default:
        return null;
    }
  };

  // Handle status update
  const handleUpdateStatus = (orderId, newStatus) => {
    if (window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${orderId} thành ${getStatusText(newStatus)}?`)) {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Apply filters, search and sorting
  let filteredOrders = [...orders];

  // Apply status filter
  if (statusFilter !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
  }

  // Apply date range filter
  if (dateRange.from) {
    filteredOrders = filteredOrders.filter(order => new Date(order.date) >= new Date(dateRange.from));
  }
  if (dateRange.to) {
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59); // End of the day
    filteredOrders = filteredOrders.filter(order => new Date(order.date) <= toDate);
  }

  // Apply search
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredOrders = filteredOrders.filter(order => 
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower) ||
      order.phone.includes(searchTerm)
    );
  }

  // Apply sorting
  if (sortConfig.key) {
    filteredOrders.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateRange, searchTerm]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
      </div>
      
      {/* Filter section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-10 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          {/* Status filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          
          {/* Date range */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="pl-10 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Từ ngày"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="pl-10 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Đến ngày"
              />
            </div>
          </div>
        </div>
        
        {/* Reset filters */}
        {(statusFilter !== 'all' || dateRange.from || dateRange.to || searchTerm) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setDateRange({ from: '', to: '' });
                setSearchTerm('');
              }}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>
      
      {/* Orders table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {loading ? (
          <div className="px-4 py-10 sm:px-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('id')}
                    >
                      Mã đơn hàng
                      {sortConfig.key === 'id' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('customerName')}
                    >
                      Khách hàng
                      {sortConfig.key === 'customerName' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('date')}
                    >
                      Ngày đặt
                      {sortConfig.key === 'date' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('total')}
                    >
                      Tổng tiền
                      {sortConfig.key === 'total' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      Trạng thái
                      {sortConfig.key === 'status' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('paymentMethod')}
                    >
                      Thanh toán
                      {sortConfig.key === 'paymentMethod' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-xs">{order.email}</div>
                          <div className="text-xs">{order.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {order.total.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.paymentMethod === 'COD' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-3">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Xem chi tiết"
                            >
                              <FiEye className="h-5 w-5" />
                            </Link>
                            
                            {/* Status update buttons */}
                            <div className="ml-2">
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'shipping')}
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                                >
                                  Giao hàng
                                </button>
                              )}
                              {order.status === 'shipping' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'completed')}
                                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                >
                                  Hoàn thành
                                </button>
                              )}
                              {(order.status === 'processing' || order.status === 'shipping') && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                  className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 ml-1"
                                >
                                  Hủy
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                        Không tìm thấy đơn hàng nào phù hợp với điều kiện tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">{indexOfFirstOrder + 1}</span> đến{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastOrder, filteredOrders.length)}
                      </span>{' '}
                      của <span className="font-medium">{filteredOrders.length}</span> đơn hàng
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Trang trước</span>
                        &laquo;
                      </button>
                      
                      {pageNumbers.map(number => (
                        <button
                          key={number}
                          onClick={() => setCurrentPage(number)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === number
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {number}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Trang sau</span>
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Order stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <FiPackage className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đơn đang xử lý
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {orders.filter(order => order.status === 'processing').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <FiTruck className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đơn đang giao
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {orders.filter(order => order.status === 'shipping').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đơn hoàn thành
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {orders.filter(order => order.status === 'completed').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <FiX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đơn đã hủy
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {orders.filter(order => order.status === 'cancelled').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;