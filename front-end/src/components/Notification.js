import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiX } from 'react-icons/fi';

const Notification = ({ type = 'success', message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <FiXCircle className="text-red-500" size={20} />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" size={20} />;
      default:
        return <FiCheckCircle className="text-green-500" size={20} />;
    }
  };
  
  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };
  
  return (
    <div className="fixed top-5 right-5 z-50 w-72 transform transition-transform duration-300 ease-in-out">
      <div className={`flex items-center p-3 border rounded-md shadow-md ${getColorClass()}`}>
        <div className="mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default Notification;