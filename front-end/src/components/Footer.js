import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-10 pb-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">FashionStore</h3>
            <p className="text-gray-400 mb-4">
              Chúng tôi cung cấp các mẫu thời trang mới nhất với chất lượng tốt nhất cho bạn.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><FiFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiYoutube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li><Link to="/category/ao" className="text-gray-400 hover:text-white">Áo</Link></li>
              <li><Link to="/category/quan" className="text-gray-400 hover:text-white">Quần</Link></li>
              <li><Link to="/category/vay" className="text-gray-400 hover:text-white">Váy</Link></li>
              <li><Link to="/category/phukien" className="text-gray-400 hover:text-white">Phụ kiện</Link></li>
              <li><Link to="/category/giaydep" className="text-gray-400 hover:text-white">Giày dép</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Thông tin</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Liên hệ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Điều khoản</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Chính sách bảo mật</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
            <p className="text-gray-400 mb-2">123 Đường ????, Cầu Giấy</p>
            <p className="text-gray-400 mb-2">Tp. Hà Nội, Việt Nam</p>
            <p className="text-gray-400 mb-2">Email: tuan_bi_gay@gmail.com</p>
            <p className="text-gray-400 mb-2">Hotline: Số lừa đảo </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-5">
          <p className="text-gray-400 text-center">© 2025 FashionStore. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;