import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiTruck, FiBarChart2, FiPieChart, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    salesData: []
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock data
          setStats({
            totalOrders: 128,
            totalSales: 32500000,
            totalCustomers: 85,
            totalProducts: 142,
            recentOrders: [
              { id: 'DH00015', customer: 'Nguyễn Văn A', date: '2023-05-15', amount: 850000, status: 'processing' },
              { id: 'DH00014', customer: 'Trần Thị B', date: '2023-05-14', amount: 1250000, status: 'shipping' },
              { id: 'DH00013', customer: 'Lê Văn C', date: '2023-05-13', amount: 450000, status: 'completed' },
              { id: 'DH00012', customer: 'Phạm Thị D', date: '2023-05-12', amount: 750000, status: 'completed' },
              { id: 'DH00011', customer: 'Hoàng Văn E', date: '2023-05-11', amount: 950000, status: 'cancelled' }
            ],
            salesData: [
              { month: 'T1', sales: 5200000 },
              { month: 'T2', sales: 6100000 },
              { month: 'T3', sales: 4800000 },
              { month: 'T4', sales: 5500000 },
              { month: 'T5', sales: 7200000 },
              { month: 'T6', sales: 6800000 },
              { month: 'T7', sales: 7500000 }
            ],
            topProducts: [
              { name: 'Áo thun unisex form rộng', sales: 42 },
              { name: 'Quần jean nam ống rộng', sales: 38 },
              { name: 'Váy liền thân nữ', sales: 25 },
              { name: 'Áo sơ mi nam dài tay', sales: 21 },
              { name: 'Giày thể thao nam', sales: 18 }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Get order status class
  const getStatusClass = (status) => {
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

  // Get order status text
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <FiShoppingBag className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng đơn hàng
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.totalOrders}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600 inline-flex items-center">
                <FiTrendingUp className="mr-1 h-4 w-4" />
                12% so với tháng trước
              </span>
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng doanh thu
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats.totalSales)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600 inline-flex items-center">
                <FiTrendingUp className="mr-1 h-4 w-4" />
                8.5% so với tháng trước
              </span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Khách hàng
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.totalCustomers}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600 inline-flex items-center">
                <FiTrendingUp className="mr-1 h-4 w-4" />
                5.2% so với tháng trước
              </span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <FiTruck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sản phẩm
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.totalProducts}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-red-600 inline-flex items-center">
                <FiTrendingDown className="mr-1 h-4 w-4" />
                3.1% so với tháng trước
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Doanh số theo tháng</h3>
              <div className="flex items-center">
                <FiBarChart2 className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="mt-6" style={{ height: '300px' }}>
              <div className="h-full flex items-end space-x-2">
                {stats.salesData.map((data, index) => (
                  <div key={index} className="relative flex-1 flex flex-col items-center">
                    <div
                      className="bg-primary rounded-t w-full transition-all duration-500"
                      style={{
                        height: `${(data.sales / Math.max(...stats.salesData.map(d => d.sales))) * 240}px`
                      }}
                    ></div>
                    <div className="mt-2 text-xs font-medium text-gray-500">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Sản phẩm bán chạy</h3>
              <div className="flex items-center">
                <FiPieChart className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-gray-700">{product.name}</span>
                    <span className="text-gray-900">{product.sales} đơn</span>
                  </div>
                  <div className="mt-2 overflow-hidden bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(product.sales / Math.max(...stats.topProducts.map(p => p.sales))) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;