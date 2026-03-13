// src/pages/Client/Auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', identifier: '', password: '' });
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // Validate dữ liệu
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập Họ và Tên của bác/cháu.');
      return;
    }
    if (!formData.identifier.trim()) {
      setError('Vui lòng nhập Số điện thoại hoặc Email để liên lạc.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự để bảo mật ạ.');
      return;
    }

    // Nếu ok -> Chuyển về trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Tạo Tài Khoản Mới</h2>
      
      {/* Khung báo lỗi */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1 pl-2">Họ và tên</label>
          <input 
            type="text" 
            placeholder="Ví dụ: Nguyễn Văn A" 
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-3 px-5 text-xl text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 pl-2">Số điện thoại hoặc Email</label>
          <input 
            type="text" 
            placeholder="0909..." 
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-3 px-5 text-xl text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 pl-2">Mật khẩu</label>
          <input 
            type="password" 
            placeholder="Tạo mật khẩu dễ nhớ..." 
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-3 px-5 text-xl text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 rounded-2xl shadow-md transition-all mt-4"
        >
          Đăng Ký Tài Khoản
        </button>
      </form>

      <div className="mt-6 text-center text-gray-600 text-lg">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default Register;