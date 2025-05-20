import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { FiGrid, FiList } from 'react-icons/fi';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [productsPerPage] = useState(8); // Số sản phẩm hiển thị mỗi trang
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('');
  
  // Fetch sản phẩm khi trang hoặc bộ lọc thay đổi
  useEffect(() => {
    fetchProducts(currentPage, filters, sortOption);
  }, [currentPage, filters, sortOption]);
  
  const fetchProducts = async (page = 0, filters = {}, sort = '') => {
    setLoading(true);
    try {
      // Xây dựng query params cho API
      let apiUrl = `http://localhost:8080/products?pageNumber=${page}&pageSize=${productsPerPage}`;
      
      // Logic để thêm các tham số lọc và sắp xếp nếu API hỗ trợ
      // Ví dụ: &sort=price,asc hoặc &category=men_shirt
      if (sort) {
        // Chuyển đổi options từ UI sang định dạng của API
        let sortParam = '';
        switch (sort) {
          case 'price-asc':
            sortParam = 'sellingPrice,asc';
            break;
          case 'price-desc':
            sortParam = 'sellingPrice,desc';
            break;
          case 'name-asc':
            sortParam = 'title,asc';
            break;
          case 'name-desc':
            sortParam = 'title,desc';
            break;
          default:
            break;
        }
        if (sortParam) {
          apiUrl += `&sort=${sortParam}`;
        }
      }
      
      // Thêm các tham số lọc khác nếu có
      if (filters.category && filters.category !== 'all') {
        apiUrl += `&category=${filters.category}`;
      }
      
      // Gọi API với các tham số đã xây dựng
      const response = await axios.get(apiUrl);
      const data = response.data;
      
      // Transform the data to match your existing product structure
      const transformedProducts = data.content.map(product => ({
        id: product.id,
        name: product.title,
        price: product.sellingPrice,
        originalPrice: product.price > product.sellingPrice ? product.price : null,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        rating: product.reviews && product.reviews.length > 0 
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
          : 4.5, // Default rating if no reviews
        sold: Math.floor(Math.random() * 1000) + 100, // Example for sold count since it's not in API
        category: product.category ? product.category.categoryId : null
      }));
      
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters, newSortOption) => {
    console.log('Filters:', newFilters);
    console.log('Sort option:', newSortOption);
    
    // Lưu bộ lọc mới và sắp xếp mới
    setFilters(newFilters);
    setSortOption(newSortOption);
    setCurrentPage(0); // Reset về trang đầu tiên sau khi lọc
    
    // Không cần gọi fetchProducts ở đây vì useEffect sẽ gọi khi filters hoặc sortOption thay đổi
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Không cần gọi fetchProducts ở đây vì useEffect sẽ gọi khi currentPage thay đổi
  };
  
  return (
    <div>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h2>
        
        <ProductFilters onFilterChange={handleFilterChange} />
        
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <button 
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={18} />
            </button>
            <button 
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('list')}
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
            
            {/* Hiển thị thông báo nếu không có sản phẩm nào */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn</p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Featured categories section */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Danh mục nổi bật</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Áo thun', 'Quần jean', 'Váy đầm', 'Đồ thể thao', 'Áo khoác', 'Phụ kiện'].map((category, index) => (
            <div 
              key={index}
              className="bg-gray-100 rounded-md p-4 flex flex-col items-center justify-center transition hover:shadow-md"
            >
              <div className="w-12 h-12 mb-3 bg-white rounded-full flex items-center justify-center">
                <img 
                  src={`https://placehold.co/40?text=${index + 1}`}
                  alt={category}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-sm font-medium">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;