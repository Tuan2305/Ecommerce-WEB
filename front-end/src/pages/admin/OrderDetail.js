import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiPrinter, FiEdit, FiUser, FiMapPin, FiCreditCard, FiCalendar, FiBox } from 'react-icons/fi';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock data for demonstration
          const mockOrder = {
            id: id,
            customerName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0901234567',
            status: 'processing',
            date: '2023-05-15T08:30:00',
            paymentMethod: 'COD',
            paymentStatus: 'pending',
            shippingAddress: {
              name: 'Nguyễn Văn A',
              phone: '0901234567',
              address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
            },
            items: [
              {
                id: 1,
                name: 'Áo thun unisex form rộng',
                variant: 'Trắng - Size L',
                price: 150000,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
              },
              {
                id: 2,
                name: 'Quần jean nam ống rộng',
                variant: 'Xanh đậm - Size 32',
                price: 480000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
              },
              {
                id: 3,
                name: 'Giày thể thao nam',
                variant: 'Trắng - Size 42',
                price: 650000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
              }
            ],
            subtotal: 1430000,
            shippingFee: 30000,
            discount: 0,
            total: 1460000,
            notes: 'Giao hàng trong giờ hành chính, gọi điện trước khi giao.',
            timeline: [
              {
                status: 'created',
                date: '2023-05-15T08:30:00',
                note: 'Đơn hàng được tạo'
              }
            ]
          };
          
          setOrder(mockOrder);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setActionType(newStatus);
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    setUpdating(true);
    setShowConfirmation(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update status in state
      const newTimeline = [
        {
          status: actionType,
          date: new Date().toISOString(),
          note: getStatusChangeNote(actionType)
        },
        ...order.timeline
      ];
      
      setOrder({
        ...order,
        status: actionType,
        timeline: newTimeline
      });
      
      // Show success message
      alert(`Trạng thái đơn hàng đã được cập nhật thành ${getStatusText(actionType)}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    } finally {
      setUpdating(false);
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setActionType(null);
  };

  const getStatusChangeNote = (status) => {
    switch (status) {
      case 'processing':
        return 'Đơn hàng đang được xử lý';
      case 'shipping':
        return 'Đơn hàng đang được giao';
      case 'completed':
        return 'Đơn hàng đã được giao thành công';
      case 'cancelled':
        return 'Đơn hàng đã bị hủy';
      default:
        return 'Trạng thái đơn hàng đã được cập nhật';
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiPackage className="text-yellow-500" />;
      case 'shipping':
        return <FiTruck className="text-blue-500" />;
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

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

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-500">Đang tải thông tin đơn hàng...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-xl mb-4">Không tìm thấy thông tin đơn hàng</div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition"
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center text-gray-600 hover:text-primary mb-2 sm:mb-0"
          >
            <FiArrowLeft className="mr-1" />
            Quay lại danh sách đơn hàng
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Chi tiết đơn hàng #{order.id}
          </h1>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiPrinter className="mr-2" />
            In đơn hàng
          </button>
          {order.status === 'processing' && (
            <button
              onClick={() => handleStatusChange('shipping')}
              disabled={updating}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <FiTruck className="mr-2" />
              Xác nhận & Giao hàng
            </button>
          )}
          {order.status === 'shipping' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={updating}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <FiCheckCircle className="mr-2" />
              Hoàn thành
            </button>
          )}
          {(order.status === 'processing' || order.status === 'shipping') && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={updating}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              <FiXCircle className="mr-2" />
              Hủy đơn
            </button>
          )}
        </div>
      </div>

      {/* Order status and date */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{getStatusText(order.status)}</span>
            </span>
            <span className="ml-4 text-gray-500 text-sm">
              <FiCalendar className="inline mr-1" />
              Ngày đặt: {formatDate(order.date)}
            </span>
          </div>
          <div className="mt-3 sm:mt-0 text-sm">
            <span className="font-semibold text-gray-700">Phương thức thanh toán:</span>{' '}
            <span className="text-gray-600">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</span>
            <br />
            <span className="font-semibold text-gray-700">Trạng thái thanh toán:</span>{' '}
            <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
              {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items and summary */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                <FiBox className="inline mr-2 text-gray-500" />
                Chi tiết sản phẩm
              </h2>
            </div>
            <div className="overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn giá
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img className="h-16 w-16 rounded object-cover" src={item.image} alt={item.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.variant}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <th scope="row" colSpan="3" className="px-6 py-3 text-right text-sm font-normal text-gray-500">
                      Tạm tính
                    </th>
                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(order.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan="3" className="px-6 py-3 text-right text-sm font-normal text-gray-500">
                      Phí vận chuyển
                    </th>
                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(order.shippingFee)}
                    </td>
                  </tr>
                  {order.discount > 0 && (
                    <tr>
                      <th scope="row" colSpan="3" className="px-6 py-3 text-right text-sm font-normal text-green-600">
                        Giảm giá
                      </th>
                      <td className="px-6 py-3 text-right text-sm font-medium text-green-600">
                        -{formatCurrency(order.discount)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-gray-200">
                    <th scope="row" colSpan="3" className="px-6 py-4 text-right text-base font-bold text-gray-900">
                      Tổng cộng
                    </th>
                    <td className="px-6 py-4 text-right text-base font-bold text-primary">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order notes */}
          {order.notes && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Ghi chú</h2>
              <div className="bg-gray-50 p-4 rounded text-gray-700">{order.notes}</div>
            </div>
          )}

          {/* Order timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lịch sử đơn hàng</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {order.timeline.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== order.timeline.length - 1 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            event.status === 'created' 
                              ? 'bg-gray-100'
                              : event.status === 'processing'
                                ? 'bg-yellow-100'
                                : event.status === 'shipping'
                                  ? 'bg-blue-100'
                                  : event.status === 'completed'
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                          }`}>
                            {event.status === 'created' 
                              ? <FiPackage className="h-5 w-5 text-gray-500" />
                              : event.status === 'processing'
                                ? <FiPackage className="h-5 w-5 text-yellow-500" />
                                : event.status === 'shipping'
                                  ? <FiTruck className="h-5 w-5 text-blue-500" />
                                  : event.status === 'completed'
                                    ? <FiCheckCircle className="h-5 w-5 text-green-500" />
                                    : <FiXCircle className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.status === 'created' 
                                ? 'Đơn hàng được tạo'
                                : event.status === 'processing'
                                  ? 'Đang xử lý'
                                  : event.status === 'shipping'
                                    ? 'Đang giao hàng'
                                    : event.status === 'completed'
                                      ? 'Đã hoàn thành'
                                      : 'Đã hủy'
                              }
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {formatDate(event.date)}
                            </p>
                          </div>
                          {event.note && (
                            <div className="mt-2 text-sm text-gray-700">
                              <p>{event.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Customer and Shipping info */}
        <div className="space-y-6">
          {/* Customer information */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                <FiUser className="inline mr-2 text-gray-500" />
                Thông tin khách hàng
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="text-base font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="text-base">{order.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                <FiMapPin className="inline mr-2 text-gray-500" />
                Địa chỉ giao hàng
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Người nhận</p>
                <p className="text-base font-medium">{order.shippingAddress.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="text-base">{order.shippingAddress.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="text-base">{order.shippingAddress.address}</p>
              </div>
            </div>
          </div>

          {/* Payment information */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                <FiCreditCard className="inline mr-2 text-gray-500" />
                Thông tin thanh toán
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="text-base font-medium">
                  {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                <p className={`text-base font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </p>
              </div>
              {order.paymentMethod !== 'COD' && order.paymentStatus === 'paid' && (
                <div>
                  <p className="text-sm text-gray-500">Ngày thanh toán</p>
                  <p className="text-base">15/05/2023 09:45</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  {actionType === 'cancelled' ? (
                    <FiXCircle className="h-6 w-6 text-red-600" />
                  ) : actionType === 'completed' ? (
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <FiTruck className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Xác nhận thay đổi trạng thái
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "{getStatusText(actionType)}"?
                      {actionType === 'cancelled' && ' Hành động này không thể hoàn tác.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={confirmStatusChange}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:col-start-2 ${
                    actionType === 'cancelled'
                      ? 'bg-red-600 hover:bg-red-700'
                      : actionType === 'completed'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Xác nhận
                </button>
                <button
                  type="button"
                  onClick={cancelConfirmation}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;