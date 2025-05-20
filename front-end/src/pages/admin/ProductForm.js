import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiX, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState(['']);
  const [error, setError] = useState('');
  
  const [product, setProduct] = useState({
    title: '',
    description: '',
    mrpPrice: '',
    sellingPrice: '',
    quantity: '',
    color: '',
    sizes: 'M, L',
    category: 'men',
    category2: 'bottom_were',
    category3: 'men_shirt'
  });

  // Danh sách danh mục cấp 1
  const categories = [
    { id: 'men', name: 'Nam' },
    { id: 'women', name: 'Nữ' },
    { id: 'kids', name: 'Trẻ em' },
    { id: 'accessories', name: 'Phụ kiện' }
  ];

  // Danh mục cấp 2 dựa trên danh mục cấp 1
  const getSubcategories = (category) => {
    switch (category) {
      case 'men':
        return [
          { id: 'bottom_were', name: 'Quần' },
          { id: 'top_were', name: 'Áo' },
          { id: 'footwear', name: 'Giày dép' }
        ];
      case 'women':
        return [
          { id: 'saree', name: 'Váy dài' },
          { id: 'top_were', name: 'Áo' },
          { id: 'bottom_were', name: 'Quần' },
          { id: 'footwear', name: 'Giày dép' }
        ];
      case 'kids':
        return [
          { id: 'top_were', name: 'Áo' },
          { id: 'bottom_were', name: 'Quần' }
        ];
      case 'accessories':
        return [
          { id: 'watches', name: 'Đồng hồ' },
          { id: 'bags', name: 'Túi xách' }
        ];
      default:
        return [];
    }
  };

  // Danh mục cấp 3 dựa trên danh mục cấp 2
  const getThirdCategories = (category, subcategory) => {
    if (category === 'men' && subcategory === 'top_were') {
      return [
        { id: 'men_shirt', name: 'Áo sơ mi' },
        { id: 'men_tshirt', name: 'Áo thun' }
      ];
    }
    if (category === 'men' && subcategory === 'bottom_were') {
      return [
        { id: 'men_jeans', name: 'Quần jeans' },
        { id: 'men_trousers', name: 'Quần vải' },
        { id: 'men_shirt', name: 'Áo sơ mi' }
      ];
    }
    if (category === 'women' && subcategory === 'top_were') {
      return [
        { id: 'women_shirt', name: 'Áo sơ mi' },
        { id: 'women_tshirt', name: 'Áo thun' }
      ];
    }
    return [];
  };

  useEffect(() => {
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id, isEditMode]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/sellers/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${admin?.jwt}`
        }
      });
      
      const productData = response.data;
      
      setProduct({
        title: productData.title || '',
        description: productData.description || '',
        mrpPrice: productData.price || '',
        sellingPrice: productData.sellingPrice || '',
        quantity: productData.quantity || '',
        color: productData.color || '',
        sizes: productData.sizes || '',
        category: productData.category?.parentCategory?.parentCategory?.categoryId || 'men',
        category2: productData.category?.parentCategory?.categoryId || 'bottom_were',
        category3: productData.category?.categoryId || 'men_shirt'
      });
      
      setImageUrls(productData.images || ['']);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);
  };

  const validateForm = () => {
    if (!product.title.trim()) {
      setError('Vui lòng nhập tên sản phẩm');
      return false;
    }
    
    if (!product.description.trim()) {
      setError('Vui lòng nhập mô tả sản phẩm');
      return false;
    }
    
    if (!product.mrpPrice || isNaN(product.mrpPrice) || Number(product.mrpPrice) <= 0) {
      setError('Vui lòng nhập giá gốc hợp lệ');
      return false;
    }
    
    if (!product.sellingPrice || isNaN(product.sellingPrice) || Number(product.sellingPrice) <= 0) {
      setError('Vui lòng nhập giá bán hợp lệ');
      return false;
    }
    
    if (!product.quantity || isNaN(product.quantity) || Number(product.quantity) < 0) {
      setError('Vui lòng nhập số lượng hợp lệ');
      return false;
    }
    
    if (!product.color.trim()) {
      setError('Vui lòng nhập màu sắc sản phẩm');
      return false;
    }
    
    // Kiểm tra ít nhất có một URL hình ảnh hợp lệ
    const validImageUrls = imageUrls.filter(url => url.trim() !== '');
    if (validImageUrls.length === 0) {
      setError('Vui lòng thêm ít nhất một hình ảnh sản phẩm');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Lọc bỏ các URL hình ảnh trống
      const validImageUrls = imageUrls.filter(url => url.trim() !== '');
      
      const productData = {
        title: product.title,
        description: product.description,
        mrpPrice: Number(product.mrpPrice),
        sellingPrice: Number(product.sellingPrice),
        quantity: Number(product.quantity),
        color: product.color,
        images: validImageUrls,
        category: product.category,
        category2: product.category2,
        category3: product.category3,
        sizes: product.sizes
      };
      
      let response;
      
      if (isEditMode) {
        response = await axios.put(`http://localhost:8080/api/sellers/products/${id}`, productData, {
          headers: {
            'Authorization': `Bearer ${admin?.jwt}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post('http://localhost:8080/api/sellers/products', productData, {
          headers: {
            'Authorization': `Bearer ${admin?.jwt}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      if (response.status === 200 || response.status === 201) {
        alert(`Sản phẩm đã được ${isEditMode ? 'cập nhật' : 'thêm'} thành công!`);
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi lưu sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>
        <div className="mt-3 sm:mt-0">
          <Link
            to="/admin/products"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <FiArrowLeft className="mr-2" />
            Quay lại
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h2>
          <p className="mt-1 text-sm text-gray-500">
            Thông tin cơ bản về sản phẩm.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Tên sản phẩm */}
          <div className="sm:col-span-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                required
                value={product.title}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
          </div>

          {/* Giá gốc */}
          <div className="sm:col-span-3">
            <label htmlFor="mrpPrice" className="block text-sm font-medium text-gray-700">
              Giá gốc <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="mrpPrice"
                id="mrpPrice"
                required
                min="0"
                value={product.mrpPrice}
                onChange={handleChange}
                className="focus:ring-primary focus:border-primary block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">VNĐ</span>
              </div>
            </div>
          </div>

          {/* Giá bán */}
          <div className="sm:col-span-3">
            <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
              Giá bán <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="sellingPrice"
                id="sellingPrice"
                required
                min="0"
                value={product.sellingPrice}
                onChange={handleChange}
                className="focus:ring-primary focus:border-primary block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">VNĐ</span>
              </div>
            </div>
          </div>

          {/* Số lượng */}
          <div className="sm:col-span-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="quantity"
                id="quantity"
                required
                min="0"
                value={product.quantity}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
          </div>

          {/* Màu sắc */}
          <div className="sm:col-span-2">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Màu sắc <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="color"
                id="color"
                required
                value={product.color}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Đen, Trắng, Đỏ,..."
              />
            </div>
          </div>

          {/* Kích thước */}
          <div className="sm:col-span-2">
            <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
              Kích thước <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="sizes"
                id="sizes"
                required
                value={product.sizes}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="S, M, L, XL"
              />
            </div>
          </div>

          {/* Danh mục cấp 1 */}
          <div className="sm:col-span-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Danh mục cấp 1 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                required
                value={product.category}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Danh mục cấp 2 */}
          <div className="sm:col-span-2">
            <label htmlFor="category2" className="block text-sm font-medium text-gray-700">
              Danh mục cấp 2 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="category2"
                name="category2"
                required
                value={product.category2}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              >
                {getSubcategories(product.category).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Danh mục cấp 3 */}
          <div className="sm:col-span-2">
            <label htmlFor="category3" className="block text-sm font-medium text-gray-700">
              Danh mục cấp 3 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="category3"
                name="category3"
                required
                value={product.category3}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              >
                {getThirdCategories(product.category, product.category2).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả sản phẩm <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                value={product.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Nhập mô tả chi tiết về sản phẩm"
              />
            </div>
          </div>
        </div>

        {/* Hình ảnh sản phẩm */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Hình ảnh sản phẩm</h2>
          <p className="mt-1 mb-4 text-sm text-gray-500">
            Thêm URL hình ảnh để hiển thị sản phẩm (ít nhất 1 hình ảnh).
          </p>
          
          <div className="space-y-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Nhập URL hình ảnh"
                />
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700"
                  disabled={imageUrls.length === 1}
                >
                  <FiX size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addImageUrl}
            className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <FiPlus className="mr-2" />
            Thêm URL hình ảnh
          </button>
          
          {/* Preview hình ảnh */}
          {imageUrls.some(url => url.trim() !== '') && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Xem trước hình ảnh:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  url.trim() !== '' && (
                    <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                        }}
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form actions */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end">
          <Link
            to="/admin/products"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none mr-3"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <FiSave className="mr-2" />
            {submitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Lưu sản phẩm')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;