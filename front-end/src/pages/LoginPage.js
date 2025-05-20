import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP, 3 for registration
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ, vui lòng kiểm tra lại');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8080/auth/sent/login-signup-otp', {
        email,
        role: 'ROLE_CUSTOMER',
      });

      if (response.data.message === 'otp sent successfully') {
        setStep(2);
        setCountdown(60); // Set 60 second countdown for OTP resend
      } else {
        setError(response.data.message || 'Không thể gửi OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi, vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('Mã OTP phải có 6 chữ số');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8080/auth/signing', {
        email,
        otp,
      });
  
      if (response.data.message === 'Login success') {
        // Lưu token và role
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('email', response.data.email);
        
        // Lưu user object để Navbar có thể hiển thị
        const user = { 
          email, 
          role: response.data.role, 
          jwt: response.data.jwt 
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        // Reload trang để AuthContext đọc lại localStorage
         window.location.href = '/';  // Thay vì navigate('/')
      } else {
        setError(response.data.message || 'Mã OTP không hợp lệ');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi, vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !otp.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8080/auth/signup', {
        fullName,
        email,
        otp,
      });

      if (response.data.message === 'User registered successfully') {
        setStep(1); // Go back to login step
      } else {
        setError(response.data.message || 'Không thể đăng ký, vui lòng thử lại sau');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi, vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    try {
      const response = await axios.post('http://localhost:8080/auth/sent/login-signup-otp', {
        email,
        role: 'ROLE_CUSTOMER',
      });

      if (response.data.message === 'otp sent successfully') {
        setCountdown(60);
        setError('');
      } else {
        setError(response.data.message || 'Không thể gửi lại OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi, vui lòng thử lại sau');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">FashionStore</h2>
          <p className="mt-2 text-gray-600">
            {step === 1 ? 'Đăng nhập tài khoản' : step === 2 ? 'Xác thực OTP' : 'Đăng ký tài khoản'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Nhập địa chỉ email của bạn"
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Tiếp tục'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center text-gray-600 hover:text-primary"
                >
                  <FiArrowLeft className="mr-1" />
                  Quay lại
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Mã OTP đã được gửi đến email <span className="font-medium">{email}</span>
              </p>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Mã OTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary tracking-widest text-center font-mono"
                  placeholder="Nhập mã OTP 6 chữ số"
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-primary hover:underline'}`}
              >
                {countdown > 0 ? `Gửi lại mã OTP sau ${countdown}s` : 'Gửi lại mã OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Mã OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Nhập mã OTP 6 chữ số"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;