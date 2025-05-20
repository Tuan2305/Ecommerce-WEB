import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';

const AddToCartButton = ({ product, quantity = 1, size, color, small = false, className = '' }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    
    if (!size || !color) {
      alert('Vui lòng chọn kích thước và màu sắc');
      return;
    }
    
    addToCart(product, quantity, size, color);
  };
  
  if (small) {
    return (
      <button 
        onClick={handleAddToCart}
        className={`p-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition ${className}`}
      >
        <FiShoppingCart size={16} />
      </button>
    );
  }
  
  return (
    <button 
      onClick={handleAddToCart}
      className={`flex items-center justify-center px-4 py-2 bg-primary text-white rounded font-medium hover:bg-secondary transition ${className}`}
    >
      <FiShoppingCart className="mr-2" />
      Thêm vào giỏ hàng
    </button>
  );
};

export default AddToCartButton;