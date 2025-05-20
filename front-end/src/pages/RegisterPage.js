import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: ''
  });
  
  // OTP verification
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: user info, 2: OTP verification
  const [countdown, setCountdown] = useState(0);
  
  // UI state
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    // Vietnam phone number validation
    const re = /^(\+84|84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters with letter and number
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate fullname
    if (!formData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ tên';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    // Validate phone
    if (!formData.mobile.trim()) {
      errors.mobile = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(formData.mobile)) {
      errors.mobile = 'Số điện thoại không hợp lệ';
    }
    
    // Validate terms agreement
    if (!agreeTos) {
      errors.agreeTos = 'Bạn phải đồng ý với điều khoản dịch vụ';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Step 1: Send OTP after completing user info form
  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send OTP to the email address
      const response = await axios.post('http://localhost:8080/auth/sent/login-signup-otp', {
        email: formData.email,
        role: 'ROLE_CUSTOMER',
      });

      if (response.data.message === 'otp sent successfully') {
        setStep(2);
        setCountdown(60); // Set 60 second countdown for OTP resend
      } else {
        setGeneralError(response.data.message || 'Không thể gửi OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      setGeneralError('Đã xảy ra lỗi, vui lòng thử lại sau');
      console.error('Error sending OTP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP if needed
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8080/auth/sent/login-signup-otp', {
        email: formData.email,
        role: 'ROLE_CUSTOMER',
      });

      if (response.data.message === 'otp sent successfully') {
        setCountdown(60);
        setGeneralError('');
      } else {
        setGeneralError(response.data.message || 'Không thể gửi lại OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      setGeneralError('Đã xảy ra lỗi, vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Complete registration with OTP verification
const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setGeneralError('');

  if (!otp.trim()) {
    setGeneralError('Vui lòng nhập mã OTP');
    return;
  }

  if (otp.trim().length !== 6) {
    setGeneralError('Mã OTP phải có 6 chữ số');
    return;
  }

  setIsSubmitting(true);

  try {
    // Complete registration with user info and OTP
    const registrationData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password, // Gửi mật khẩu nếu backend yêu cầu
      mobile: formData.mobile,
      otp: otp
    };

    const response = await axios.post('http://localhost:8080/auth/signup', registrationData);

    if (response.data.success || response.status === 200) {
      // Chuyển hướng trực tiếp đến trang đăng nhập khi đăng ký thành công
      navigate('/login', { 
        state: { 
          registrationSuccess: true,
          email: formData.email,
          message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.'
        }
      });
    } else {
      setGeneralError(response.data.message || 'Đăng ký không thành công, vui lòng thử lại');
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Xử lý lỗi chi tiết hơn từ API
    const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký, vui lòng thử lại sau';
    setGeneralError(errorMsg);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">FashionStore</h2>
          <p className="mt-2 text-gray-600">
            {step === 1 ? 'Đăng ký tài khoản mới' : 'Xác thực email'}
          </p>
        </div>

        {/* Step 1: User Information Form */}
        {step === 1 ? (
          <form onSubmit={handleSubmitUserInfo} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Nhập họ và tên"
                />
              </div>
              {formErrors.fullName && (
                <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>
              )}
            </div>
            
            {/* Email Field */}
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-10 py-3 border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Nhập mật khẩu"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              {formErrors.password ? (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số
                </p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-10 py-3 border ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Xác nhận mật khẩu"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
            </div>
            
            {/* Mobile Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border ${
                    formErrors.mobile ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              {formErrors.mobile ? (
                <p className="mt-1 text-sm text-red-500">{formErrors.mobile}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Ví dụ: 0912345678
                </p>
              )}
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTos"
                  name="agreeTos"
                  type="checkbox"
                  checked={agreeTos}
                  onChange={() => setAgreeTos(!agreeTos)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTos" className="text-gray-700">
                  Tôi đồng ý với <Link to="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
                </label>
                {formErrors.agreeTos && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.agreeTos}</p>
                )}
              </div>
            </div>
            
            {/* General Error Message */}
            {generalError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {generalError}
              </div>
            )}
            
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang gửi...' : 'Tiếp tục'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản? <Link to="/login" className="font-medium text-primary hover:underline">Đăng nhập</Link>
              </p>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification Form */
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
                Mã OTP đã được gửi đến email <span className="font-medium">{formData.email}</span>
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

            {generalError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {generalError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isSubmitting}
                className={`text-sm ${countdown > 0 || isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'}`}
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

export default RegisterPage;