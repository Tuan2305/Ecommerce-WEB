import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const ProductFilters = ({ onFilterChange }) => {
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
  const colors = ['Đen', 'Trắng', 'Đỏ', 'Xanh', 'Vàng', 'Hồng'];

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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    onFilterChange && onFilterChange(selectedFilters, e.target.value);
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
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center text-dark px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 md:hidden"
        >
          <FiFilter className="mr-2" />
          Lọc
          <FiChevronDown className={`ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sắp xếp theo:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="popularity">Phổ biến</option>
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="rating">Đánh giá</option>
          </select>
        </div>
      </div>

      <div className={`md:flex md:space-x-6 overflow-hidden transition-all duration-300 ${isFilterOpen ? 'max-h-[1000px]' : 'max-h-0 md:max-h-[1000px]'}`}>
        <div className="mb-4 md:mb-0">
          <h4 className="font-medium mb-2">Danh mục</h4>
          <div className="space-y-1">
            {categories.map((category, index) => (
              <label key={index} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2 accent-primary"
                  checked={selectedFilters.categories.includes(category)}
                  onChange={() => handleFilterToggle('categories', category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4 md:mb-0">
          <h4 className="font-medium mb-2">Kích cỡ</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                className={`w-8 h-8 flex items-center justify-center border ${selectedFilters.sizes.includes(size) ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary text-gray-800'}`}
                onClick={() => handleFilterToggle('sizes', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 md:mb-0">
          <h4 className="font-medium mb-2">Màu sắc</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <label
                key={index}
                className="flex items-center text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedFilters.colors.includes(color)}
                  onChange={() => handleFilterToggle('colors', color)}
                />
                <span
                  className={`mr-1 w-5 h-5 border inline-block ${selectedFilters.colors.includes(color)
                      ? 'bg-primary border-primary relative after:content-["✓"] after:absolute after:text-white after:text-xs after:top-0 after:left-1'
                      : 'border-gray-300'
                    }`}
                ></span>
                {color}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Giá</h4>
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
          </div>
        </div>
      </div>

      {/* Selected filters */}
      {(selectedFilters.categories.length > 0 ||
        selectedFilters.sizes.length > 0 ||
        selectedFilters.colors.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Đã chọn:</span>

            {selectedFilters.categories.map((item, index) => (
              <span key={`cat-${index}`} className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                {item}
                <button
                  onClick={() => handleFilterToggle('categories', item)}
                  className="ml-1 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            {selectedFilters.sizes.map((item, index) => (
              <span key={`size-${index}`} className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                Size {item}
                <button
                  onClick={() => handleFilterToggle('sizes', item)}
                  className="ml-1 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            {selectedFilters.colors.map((item, index) => (
              <span key={`color-${index}`} className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                Màu {item}
                <button
                  onClick={() => handleFilterToggle('colors', item)}
                  className="ml-1 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}
    </div>
  );
};

export default ProductFilters;