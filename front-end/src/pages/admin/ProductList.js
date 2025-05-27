import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiPlus, FiFilter } from 'react-icons/fi';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, sortField, sortDirection, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
  try {
    setLoading(true);
    
    // Build query parameters with the correct parameter names
    const params = new URLSearchParams();
    params.append('pageNumber', currentPage - 1); // API uses 0-based indexing
    params.append('pageSize', productsPerPage);
    
    // Add sorting if needed
    if (sortField && sortDirection) {
      params.append('sort', `${sortField},${sortDirection}`);
    }
    
    // Add category filter if selected
    if (categoryFilter !== 'all') {
      params.append('category', categoryFilter);
    }

    // API endpoint with query parameters
    const response = await axios.get(`http://localhost:8080/products?${params.toString()}`);
    
    const data = response.data;
    // Check the structure of the response
    if (data && Array.isArray(data.content)) {
      setProducts(data.content);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || data.content.length);
    } else if (Array.isArray(data)) {
      // If the API returns an array directly
      setProducts(data);
      setTotalPages(1);
      setTotalElements(data.length);
    } else {
      setProducts([]);
      setTotalPages(0);
      setTotalElements(0);
    }
    
    setLoading(false);
  } catch (error) {
    console.error('Error fetching products:', error);
    setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
    setLoading(false);
  }
};

  const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8080/categories');
    console.log('Categories response:', response.data); // Debug log
    
    // Handle different possible response formats
    if (Array.isArray(response.data)) {
      setCategories(response.data);
    } else if (response.data && typeof response.data === 'object') {
      // If it's a paginated response with content property
      if (Array.isArray(response.data.content)) {
        setCategories(response.data.content);
      } else {
        // Convert object to array if needed
        const categoryArray = Object.values(response.data);
        if (Array.isArray(categoryArray) && categoryArray.length > 0) {
          setCategories(categoryArray);
        } else {
          setCategories([]);
        }
      }
    } else {
      setCategories([]);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    setCategories([]); // Always set to empty array on error
  }
};

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await axios.delete(`http://localhost:8080/products/${id}`);
        fetchProducts(); // Refresh the list
        alert('Sản phẩm đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau.');
      }
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && product.quantity > 0) ||
                          (statusFilter === 'inactive' && product.quantity === 0);
    
    return matchesSearch && matchesStatus;
  });

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &laquo;
      </button>
    );
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      // Only show current page, first, last, and pages around current
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {i}
          </button>
        );
      } else if (
        i === currentPage - 3 || 
        i === currentPage + 3
      ) {
        // Show ellipsis
        pages.push(
          <span key={i} className="px-2">
            ...
          </span>
        );
      }
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &raquo;
      </button>
    );
    
    return (
      <div className="flex justify-center space-x-1 mt-6">
        {pages}
      </div>
    );
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
    setSortField('title');
    setSortDirection('asc');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <div className="mt-3 sm:mt-0">
          <Link
            to="/admin/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none"
          >
            <FiPlus className="mr-2" />
            Thêm sản phẩm mới
          </Link>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary appearance-none"
  >
    <option value="all">Tất cả danh mục</option>
    {Array.isArray(categories) && categories.length > 0 ? categories.map(category => (
      <option key={category.id || category.category_id} value={category.id || category.category_id}>
        {category.name || (category.category_id ? `Danh mục ${category.category_id}` : 'Không tên')}
      </option>
    )) : (
      <option disabled>Không có danh mục</option>
    )}
  </select>
  <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
</div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </select>
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Products table */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        {loading ? (
          <div className="bg-white px-4 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <div className="mt-4 text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortField === 'id' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Sản phẩm
                      {sortField === 'title' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Giá gốc
                      {sortField === 'price' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('sellingPrice')}
                  >
                    <div className="flex items-center">
                      Giá bán
                      {sortField === 'sellingPrice' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      Kho
                      {sortField === 'quantity' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Ngày tạo
                      {sortField === 'createdAt' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="line-clamp-2">
                          {product.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.title} 
                            className="h-12 w-12 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category ? product.category.name : 'Không có danh mục'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.price.toLocaleString()}đ
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sellingPrice.toLocaleString()}đ
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/product/${product.id}`} 
                            className="text-indigo-600 hover:text-indigo-900"
                            target="_blank"
                          >
                            <FiEye />
                          </Link>
                          <Link 
                            to={`/admin/products/edit/${product.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit />
                          </Link>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Product count */}
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Hiển thị {Math.min(productsPerPage, filteredProducts.length)} trên tổng số {totalElements} sản phẩm
        </div>
      )}
    </div>
  );
};

export default ProductList;