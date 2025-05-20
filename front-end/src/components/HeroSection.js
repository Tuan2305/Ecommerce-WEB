import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-secondary text-white py-10 md:py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Bộ sưu tập mới nhất 2023</h1>
          <p className="text-lg mb-6 opacity-90">
            Khám phá xu hướng thời trang mùa này với những thiết kế độc đáo và sang trọng.
            Giảm giá lên đến 50% cho các sản phẩm mới nhất.
          </p>
          <div className="flex space-x-4">
            <Link to="/category/new-arrivals" className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition">
              Khám phá ngay
            </Link>
            <Link to="/category/sale" className="px-6 py-3 border-2 border-white font-semibold rounded-md hover:bg-white hover:text-primary transition">
              Xem ưu đãi
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
            alt="Fashion collection 2023"
            className="rounded-md shadow-lg max-w-xs md:max-w-md object-cover"
          />
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
    </div>
  );
};

export default HeroSection;