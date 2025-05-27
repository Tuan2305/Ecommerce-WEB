import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiX, FiGrid, FiList } from 'react-icons/fi';

const ProductFilters = ({ onFilterChange, viewMode, setViewMode }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 2000000],
  });

  const [sortOption, setSortOption] = useState('popularity');

  const categories = ['Áo thun', 'Áo sơ mi', 'Quần jean', 'Váy', 'Đầm', 'Áo khoác'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Đen', color: '#000000' },
    { name: 'Trắng', color: '#FFFFFF' },
    { name: 'Đỏ', color: '#FF0000' },
    { name: 'Xanh', color: '#0000FF' },
    { name: 'Vàng', color: '#FFFF00' },
    { name: 'Hồng', color: '#FFC0CB' }
  ];
  
  const sortOptions = [
    { id: 'popularity', name: 'Phổ Biến' },
    { id: 'newest', name: 'Mới Nhất' },
    { id: 'price_asc', name: 'Giá: Thấp đến Cao' },
    { id: 'price_desc', name: 'Giá: Cao đến Thấp' },
    { id: 'rating', name: 'Đánh Giá' }
  ];

  const handleFilterToggle = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };

      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }

      return newFilters;
    });

    // Call the parent component function to apply filters
    onFilterChange && onFilterChange(selectedFilters, sortOption);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    onFilterChange && onFilterChange(selectedFilters, option);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 2000000],
    });
    onFilterChange && onFilterChange({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 2000000],
    }, sortOption);
  };

  return (
    <div className="mb-6">
      {/* Main filter bar - Sort options and toggles */}
      <div className="bg-white shadow-sm rounded-md p-3 mb-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-gray-600 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 md:hidden"
          >
            <FiFilter className="mr-2" />
            <span>Lọc</span>
            <FiChevronDown className={`ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort options as buttons - Shopee style */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 text-sm mr-2 hidden md:inline">Sắp xếp theo:</span>
            <div className="flex flex-wrap gap-1">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  className={`px-3 py-1.5 text-sm border rounded-sm ${
                    sortOption === option.id
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-800 border-gray-300 hover:border-primary'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* View mode toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <button 
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={18} />
            </button>
            <button 
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('list')}
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters section - expands on mobile */}
      <div className={`bg-white shadow-sm rounded-md overflow-hidden transition-all duration-300 ${isFilterOpen ? 'max-h-[1000px]' : 'max-h-0 md:max-h-[1000px]'}`}>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2">Danh mục</h4>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <label key={index} className="flex items-center text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 accent-primary"
                      checked={selectedFilters.categories.includes(category)}
                      onChange={() => handleFilterToggle('categories', category)}
                    />
                    <span className="text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2">Kích cỡ</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center ${
                      selectedFilters.sizes.includes(size)
                        ? 'bg-primary text-white border-0' 
                        : 'bg-gray-100 text-gray-800 hover:border hover:border-primary'
                    } rounded`}
                    onClick={() => handleFilterToggle('sizes', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2">Màu sắc</h4>
              <div className="flex flex-wrap gap-3">
                {colors.map((colorObj, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <button
                      onClick={() => handleFilterToggle('colors', colorObj.name)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedFilters.colors.includes(colorObj.name)
                          ? 'border-primary' 
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: colorObj.color }}
                    >
                      {selectedFilters.colors.includes(colorObj.name) && (
                        <span className="flex items-center justify-center h-full text-white">
                          {colorObj.color === '#FFFFFF' && <span className="text-black">✓</span>}
                          {colorObj.color !== '#FFFFFF' && <span>✓</span>}
                        </span>
                      )}
                    </button>
                    <span className="text-xs mt-1">{colorObj.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2">Giá</h4>
              <div className="px-2">
                <div className="h-2 bg-gray-200 rounded-full mb-4 relative">
                  <div
                    className="absolute h-full bg-primary rounded-full"
                    style={{
                      left: `${(selectedFilters.priceRange[0] / 2000000) * 100}%`,
                      right: `${100 - (selectedFilters.priceRange[1] / 2000000) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{selectedFilters.priceRange[0].toLocaleString()}đ</span>
                  <span>{selectedFilters.priceRange[1].toLocaleString()}đ</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    className="border p-2 rounded text-sm"
                    placeholder="₫ TỪ" 
                  />
                  <input 
                    type="number" 
                    className="border p-2 rounded text-sm"
                    placeholder="₫ ĐẾN" 
                  />
                </div>
                <button className="mt-2 bg-primary text-white text-sm px-3 py-1 rounded w-full">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected filters display */}
      {(selectedFilters.categories.length > 0 || selectedFilters.sizes.length > 0 || selectedFilters.colors.length > 0) && (
        <div className="mt-3 bg-white p-3 rounded-md shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Đã chọn:</span>

            {selectedFilters.categories.map((item, index) => (
              <span key={`cat-${index}`} className="px-3 py-1 bg-gray-100 text-sm rounded-full flex items-center border border-gray-200">
                {item}
                <button
                  onClick={() => handleFilterToggle('categories', item)}
                  className="ml-2 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            {selectedFilters.sizes.map((item, index) => (
              <span key={`size-${index}`} className="px-3 py-1 bg-gray-100 text-sm rounded-full flex items-center border border-gray-200">
                Size {item}
                <button
                  onClick={() => handleFilterToggle('sizes', item)}
                  className="ml-2 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            {selectedFilters.colors.map((item, index) => (
              <span key={`color-${index}`} className="px-3 py-1 bg-gray-100 text-sm rounded-full flex items-center border border-gray-200">
                Màu {item}
                <button
                  onClick={() => handleFilterToggle('colors', item)}
                  className="ml-2 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm text-primary hover:bg-gray-50 border border-primary rounded-full"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;