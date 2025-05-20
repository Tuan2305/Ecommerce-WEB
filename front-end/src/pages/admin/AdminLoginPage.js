import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, login, sendOTP } = useAdminAuth();

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Kiểm tra đăng nhập khi tải trang
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
      const result = await sendOTP(email);

      if (result.success) {
        setStep(2);
        setCountdown(60); // Set 60 second countdown for OTP resend
      } else {
        setError(result.message || 'Không thể gửi OTP, vui lòng thử lại sau');
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
      const result = await login(email, otp);
  
      if (result.success) {
        // Chuyển hướng đến trang admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Đăng nhập thất bại');
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
      const result = await sendOTP(email);

      if (result.success) {
        setCountdown(60);
        setError('');
      } else {
        setError(result.message || 'Không thể gửi lại OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi, vui lòng thử lại sau');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Admin Panel</h2>
          <p className="mt-2 text-gray-600">
            {step === 1 ? 'Đăng nhập tài khoản quản trị' : 'Xác thực OTP'}
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
                  placeholder="Nhập địa chỉ email quản trị"
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
      </div>
    </div>
  );
};

export default AdminLoginPage;