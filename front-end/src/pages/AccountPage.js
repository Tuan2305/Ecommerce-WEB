import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMapPin, FiPhone, FiMail, FiEdit, FiPlus, FiChevronRight, FiLock, FiPackage, FiHeart, FiCreditCard } from 'react-icons/fi';

const AccountPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Thêm state vào component AccountPage
const [isAddingAddress, setIsAddingAddress] = useState(false);
const [newAddress, setNewAddress] = useState({
  name: '',
  address: '',
  city: '',
  mobile: '',
  isDefault: false
});
const [addressError, setAddressError] = useState('');

// Hàm xử lý thêm địa chỉ mới
const handleAddAddress = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setAddressError('');
  
  try {
    // Validate form
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.mobile) {
      setAddressError('Vui lòng nhập đầy đủ thông tin');
      setIsSubmitting(false);
      return;
    }
    
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No JWT token found');
      return;
    }
    
    const response = await fetch('http://localhost:8080/api/addresses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAddress)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const addedAddress = await response.json();
    
    // Fetch updated list of addresses
    await fetchAddresses();
    
    // Reset form and close it
    setNewAddress({
      name: '',
      address: '',
      city: '',
      mobile: '',
      isDefault: false
    });
    setIsAddingAddress(false);
    
    alert('Địa chỉ đã được thêm thành công!');
  } catch (error) {
    console.error('Error adding address:', error);
    setAddressError('Đã xảy ra lỗi khi thêm địa chỉ. Vui lòng thử lại sau.');
  } finally {
    setIsSubmitting(false);
  }
};

// Hàm xử lý xóa địa chỉ
const handleDeleteAddress = async (addressId) => {
  if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No JWT token found');
      return;
    }
    
    const response = await fetch(`http://localhost:8080/api/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Update addresses state by removing the deleted address
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    
    alert('Địa chỉ đã được xóa thành công!');
  } catch (error) {
    console.error('Error deleting address:', error);
    alert('Đã xảy ra lỗi khi xóa địa chỉ. Vui lòng thử lại sau.');
  }
};

// Hàm để lấy danh sách địa chỉ
const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No JWT token found');
      return;
    }
    
    const response = await fetch('http://localhost:8080/api/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const addressData = await response.json();
    setAddresses(addressData);
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};

// Hàm xử lý thay đổi mặc định địa chỉ
const handleSetDefault = async (addressId) => {
  try {
    // Create a copy of addresses array with the selected address set as default
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    
    // Update frontend immediately for responsive feel
    setAddresses(updatedAddresses);
    
    // Send API request to update the default address
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No JWT token found');
      return;
    }
    
    const addressToUpdate = addresses.find(addr => addr.id === addressId);
    if (!addressToUpdate) return;
    
    const response = await fetch(`http://localhost:8080/api/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...addressToUpdate,
        isDefault: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      // If fail, revert the frontend changes
      await fetchAddresses();
    }
  } catch (error) {
    console.error('Error setting default address:', error);
    alert('Đã xảy ra lỗi khi thiết lập địa chỉ mặc định. Vui lòng thử lại sau.');
    // Refresh addresses to revert changes
    await fetchAddresses();
  }
};

// Hàm xử lý thay đổi trong form thêm địa chỉ
const handleNewAddressChange = (e) => {
  const { name, value, type, checked } = e.target;
  setNewAddress(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};
// Thêm useEffect riêng để tải địa chỉ
useEffect(() => {
  if (currentUser) {
    fetchAddresses();
  }
}, [currentUser]);

// Lưu dữ liệu địa chỉ vào localStorage khi nó thay đổi
useEffect(() => {
  if (isAddingAddress && (newAddress.name || newAddress.address || newAddress.city || newAddress.mobile)) {
    localStorage.setItem('tempAddressData', JSON.stringify(newAddress));
  }
}, [newAddress, isAddingAddress]);

// Khôi phục dữ liệu từ localStorage khi mở form thêm địa chỉ
useEffect(() => {
  if (isAddingAddress) {
    const savedData = localStorage.getItem('tempAddressData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setNewAddress(parsedData);
      } catch (e) {
        console.error('Error parsing saved address data', e);
      }
    }
  } else {
    // Xóa dữ liệu tạm khi đã lưu hoặc hủy thành công
    localStorage.removeItem('tempAddressData');
  }
}, [isAddingAddress]);

  useEffect(() => {
    // Fetch real user data from API if user is logged in
    if (currentUser) {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
          // Get JWT token from localStorage
          const token = localStorage.getItem('jwt');
          
          if (!token) {
            console.error('No JWT token found');
            return;
          }

          const response = await fetch('http://localhost:8080/users/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const userData = await response.json();
          
          // Update profile with real data
          setProfile({
            name: userData.fullName || '',
            email: userData.email || '',
            phone: userData.mobile || '',
            gender: userData.gender || '',  // This field might not be in the API
            birthday: userData.birthday || '', // This field might not be in the API
          });

          // Update addresses with real data
          if (userData.addresses && userData.addresses.length > 0) {
            const formattedAddresses = userData.addresses.map(addr => ({
              id: addr.id,
              name: addr.name || userData.fullName,
              phone: addr.mobile || userData.mobile,
              address: addr.address || '',
              city: addr.city || '',
              isDefault: false // Add default flag
            }));
            
            // Set the first address as default if none is marked
            if (formattedAddresses.length > 0 && !formattedAddresses.some(a => a.isDefault)) {
              formattedAddresses[0].isDefault = true;
            }
            
            setAddresses(formattedAddresses);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fall back to mock data if there's an error
          setProfile({
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: '',
            gender: '',
            birthday: '',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('jwt');
      
      if (!token) {
        console.error('No JWT token found');
        return;
      }
  
      // Format date in YYYY-MM-DD if present
      let formattedBirthday = profile.birthday;
      if (profile.birthday && !profile.birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // If birthday is not in the correct format, attempt to format it
        const date = new Date(profile.birthday);
        if (!isNaN(date.getTime())) {
          formattedBirthday = date.toISOString().split('T')[0];
        }
      }
  
      // Prepare data for API - match field names with backend expectations
      const updateData = {
        fullName: profile.name,
        mobile: profile.phone,
        gender: profile.gender,
        birthday: formattedBirthday
      };
  
      const response = await fetch('http://localhost:8080/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the response to get updated user data
      const updatedUserData = await response.json();
      
      // Update profile state with returned data
      setProfile({
        name: updatedUserData.fullName || '',
        email: updatedUserData.email || '',
        phone: updatedUserData.mobile || '',
        gender: updatedUserData.gender || '',
        birthday: updatedUserData.birthday || ''
      });
      
      // Update addresses if present in the response
      if (updatedUserData.addresses && updatedUserData.addresses.length > 0) {
        const formattedAddresses = updatedUserData.addresses.map(addr => ({
          id: addr.id,
          name: addr.name || updatedUserData.fullName,
          phone: addr.mobile || updatedUserData.mobile,
          address: addr.address || '',
          city: addr.city || '',
          isDefault: false
        }));
        
        if (formattedAddresses.length > 0) {
          formattedAddresses[0].isDefault = true;
        }
        
        setAddresses(formattedAddresses);
      }
  
      // Update user in localStorage to reflect changes
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.name = updatedUserData.fullName;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      alert('Thông tin đã được cập nhật thành công!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">Vui lòng đăng nhập để xem thông tin tài khoản</h2>
        <Link to="/login" className="inline-block px-4 py-2 bg-primary text-white rounded">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="text-xl font-bold">{profile.name[0]?.toUpperCase()}</span>
              </div>
              <div>
                <h3 className="font-medium">{profile.name}</h3>
                <Link to="/account" className="text-sm text-gray-500 flex items-center">
                  <FiEdit className="mr-1" size={12} />
                  Sửa hồ sơ
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <div className={`flex items-center px-3 py-2 rounded cursor-pointer ${activeTab === 'profile' ? 'text-primary bg-orange-50' : 'hover:bg-gray-100'}`} onClick={() => setActiveTab('profile')}>
                <FiUser className="mr-2" />
                <span>Thông tin tài khoản</span>
              </div>
              <div className={`flex items-center px-3 py-2 rounded cursor-pointer ${activeTab === 'address' ? 'text-primary bg-orange-50' : 'hover:bg-gray-100'}`} onClick={() => setActiveTab('address')}>
                <FiMapPin className="mr-2" />
                <span>Địa chỉ của tôi</span>
              </div>
              <Link to="/orders" className="flex items-center px-3 py-2 rounded hover:bg-gray-100">
                <FiPackage className="mr-2" />
                <span>Đơn mua</span>
              </Link>
              <div className="flex items-center px-3 py-2 rounded cursor-pointer hover:bg-gray-100">
                <FiHeart className="mr-2" />
                <span>Sản phẩm yêu thích</span>
              </div>
              <div className="flex items-center px-3 py-2 rounded cursor-pointer hover:bg-gray-100">
                <FiCreditCard className="mr-2" />
                <span>Thẻ tín dụng/Ghi nợ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'profile' && (
              <div>
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Hồ Sơ Của Tôi</h2>
                  <p className="text-sm text-gray-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="border-b pb-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-right text-gray-500">Tên đăng nhập</div>
                          <div className="md:col-span-2">{profile.name}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-right text-gray-500">Tên</div>
                          <div className="md:col-span-2">
                            {isEditingProfile ? (
                              <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                              />
                            ) : (
                              profile.name
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-right text-gray-500">Email</div>
                          <div className="md:col-span-2 flex items-center">
                            {profile.email}
                            <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Đã xác thực</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-right text-gray-500">Số điện thoại</div>
                          <div className="md:col-span-2">
                            {isEditingProfile ? (
                              <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                              />
                            ) : (
                              profile.phone || 'Chưa có thông tin'
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-right text-gray-500">Giới tính</div>
                          <div className="md:col-span-2">
                            {isEditingProfile ? (
                              <div className="flex space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="Nam"
                                    checked={profile.gender === 'Nam'}
                                    onChange={handleProfileChange}
                                    className="mr-2"
                                  />
                                  Nam
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="Nữ"
                                    checked={profile.gender === 'Nữ'}
                                    onChange={handleProfileChange}
                                    className="mr-2"
                                  />
                                  Nữ
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="Khác"
                                    checked={profile.gender === 'Khác'}
                                    onChange={handleProfileChange}
                                    className="mr-2"
                                  />
                                  Khác
                                </label>
                              </div>
                            ) : (
                              profile.gender || 'Chưa có thông tin'
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-right text-gray-500">Ngày sinh</div>
                          <div className="md:col-span-2">
                            {isEditingProfile ? (
                              <input
                                type="date"
                                name="birthday"
                                value={profile.birthday}
                                onChange={handleProfileChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                              />
                            ) : (
                              profile.birthday || 'Chưa có thông tin'
                            )}
                          </div>
                        </div>

                        {isEditingProfile && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="md:col-start-2 md:col-span-2">
                              <button
                                type="submit"
                                className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                              </button>
                              <button
                                type="button"
                                className="ml-2 px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
                                onClick={() => setIsEditingProfile(false)}
                                disabled={isSubmitting}
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center mb-2 overflow-hidden">
                          {profile.photoURL ? (
                            <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl font-bold text-gray-300">{profile.name[0]?.toUpperCase()}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="text-sm text-primary border border-primary rounded px-4 py-1 hover:bg-orange-50"
                        >
                          Chọn ảnh
                        </button>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Dụng lượng file tối đa 1 MB
                          <br />
                          Định dạng: .JPEG, .PNG
                        </p>
                      </div>
                    </div>

                    {!isEditingProfile && (
                      <div className="text-center">
                        <button
                          type="button"
                          className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          Sửa thông tin
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

{activeTab === 'address' && (
  <div>
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold">Địa Chỉ Của Tôi</h2>
    </div>

    <div className="p-6">
      {!isAddingAddress ? (
        <button 
          className="w-full border border-dashed border-primary text-primary rounded-md p-4 mb-6 flex items-center justify-center hover:bg-orange-50"
          onClick={() => setIsAddingAddress(true)}
        >
          <FiPlus className="mr-2" />
          Thêm địa chỉ mới
        </button>
      ) : (
        <div className="border rounded-md p-4 mb-6">
          <h3 className="font-medium mb-4">Thêm địa chỉ mới</h3>
          <form onSubmit={handleAddAddress}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên của bạn
                </label>
                <input
                  type="text"
                  name="name"
                  value={newAddress.name}
                  onChange={handleNewAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Ví dụ: Nguyen Van A"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={newAddress.mobile}
                  onChange={handleNewAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ 
                </label>
                <input
                  type="text"
                  name="address"
                  value={newAddress.address}
                  onChange={handleNewAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Số nhà, tên đường, phường/xã"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thành phố
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Nhập thành phố"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleNewAddressChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
              
              {addressError && (
                <div className="text-red-500 text-sm">{addressError}</div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  onClick={() => setIsAddingAddress(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {addresses.length > 0 ? (
        addresses.map((address) => (
          <div key={address.id} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">{address.name}</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-500 ml-2">{address.mobile}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-primary hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
            <div className="text-gray-600 mb-2">{address.address}</div>
            <div className="text-gray-600 mb-2">{address.city}</div>
            {address.isDefault ? (
              <div className="inline-block border border-red-500 text-red-500 text-xs px-2 py-1 rounded">
                Mặc định
              </div>
            ) : (
              <button 
                onClick={() => handleSetDefault(address.id)}
                className="text-primary text-sm hover:underline"
              >
                Thiết lập mặc định
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới!
        </div>
      )}
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;