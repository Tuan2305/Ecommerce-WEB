import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product }) => {
  const { id, image, name, price, originalPrice, rating, sold } = product;
  
  const discount = originalPrice ? Math.round((originalPrice - price) / originalPrice * 100) : 0;
  
  return (
    <Link to={`/product/${id}`} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition group">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">{name}</h3>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-primary font-semibold">{price.toLocaleString()}đ</span>
            {originalPrice && (
              <span className="text-gray-400 text-xs line-through ml-1">
                {originalPrice.toLocaleString()}đ
              </span>
            )}
          </div>
          
          <div className="block md:hidden lg:block">
            <AddToCartButton productId={id} small />
          </div>
        </div>
        
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <div className="flex items-center">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="ml-1">{rating}</span>
          </div>
          <span className="mx-2">|</span>
          <span>Đã bán {sold}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;