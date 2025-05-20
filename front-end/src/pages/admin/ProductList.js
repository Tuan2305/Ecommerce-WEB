import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiPlus } from 'react-icons/fi';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('all');

  // Gọn lại admin state
  const admin = JSON.parse(localStorage.getItem('admin')) || null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Tạo đối tượng params chỉ với các giá trị không phải null/undefined
        const params = {
          page: pageNumber,
          size: productsPerPage,
          sort: `${sortField},${sortDirection}`,
        };
        if (category && category !== 'all') params.category = category;
        if (searchQuery) params.keyword = searchQuery;
        
        const response = await axios.get('http://localhost:8080/api/sellers/products', {
          params,
          headers: {
            'Authorization': `Bearer ${admin?.jwt}`
          }
        });
        
        // Kiểm tra cấu trúc phản hồi
        if (response.data && response.data.content) {
          setProducts(response.data.content);
          setTotalPages(response.data.totalPages);
        } else if (Array.isArray(response.data)) {
          // Trường hợp API trả về danh sách sản phẩm trực tiếp
          setProducts(response.data);
          setTotalPages(Math.ceil(response.data.length / productsPerPage));
        } else {
          // Trường hợp API trả về cấu trúc khác
          console.error('Unexpected API response format:', response.data);
          setProducts([]);
          setTotalPages(0);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        setProducts([]);
      }
    };
    
    fetchProducts();
  }, [pageNumber, productsPerPage, searchQuery, category, sortField, sortDirection, admin?.jwt]);
  

  useEffect(() => {
  // Thêm hàm lấy danh mục
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  fetchCategories();
  }, []);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortField === 'sellingPrice' || sortField === 'quantity') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else if (sortField === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortField === 'category') {
      const catA = a.category?.categoryId || '';
      const catB = b.category?.categoryId || '';
      return sortDirection === 'asc'
        ? catA.localeCompare(catB)
        : catB.localeCompare(catA);
    } else {
      return 0;
    }
  });

  // Filter products based on search query
  const filteredProducts = sortedProducts.filter(product => {
    const titleMatch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = category === 'all' || product.category?.id?.toString() === category;
    const statusMatch = status === 'all' || 
      (status === 'active' && product.quantity > 0) || 
      (status === 'inactive' && product.quantity === 0);

    return titleMatch && categoryMatch && statusMatch;
  });
  

  // Pagination logic
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  // // const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = filteredProducts;

  // Sửa hàm xử lý phân trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setPageNumber(newPage - 1);  };



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
        await axios.delete(`http://localhost:8080/api/sellers/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${admin?.jwt}`
          }
        });
        // Cập nhật danh sách sau khi xóa
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      }
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
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
             onClick={() => handlePageChange(i)} 
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
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {/* <option value="ao-thun">Áo thun</option>
              <option value="quan-jean">Quần jean</option>
              <option value="vay">Váy</option>
              <option value="ao-khoac">Áo khoác</option>
              <option value="phu-kien">Phụ kiện</option> */}
              {categories.map(cat => (
              <option key={cat.id} value={cat.id || cat.categoryId}>
              {cat.name}
              </option>
            ))}

              </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Ngừng bán</option>
            </select>
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
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Danh mục
                    {sortField === 'category' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Giá
                    {sortField === 'price' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center">
                    Kho
                    {sortField === 'stock' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Trạng thái
                    {sortField === 'status' && (
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
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                     {product.category?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sellingPrice?.toLocaleString()}đ
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity || 0} 
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.quantity > 0 ? 'Đang bán' : 'Ngừng bán'}
                      </span>
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
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ProductList;