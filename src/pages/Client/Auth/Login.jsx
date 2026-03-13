// src/pages/Client/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Xóa lỗi cũ

    // Validate cơ bản
    if (!formData.identifier.trim()) {
      setError('Bác/cháu vui lòng nhập Email hoặc Số điện thoại ạ.');
      return;
    }
    if (!formData.password) {
      setError('Bác/cháu chưa nhập mật khẩu.');
      return;
    }

    // Nếu ok -> Chuyển vào trang chủ (Sau này gọi API thực tế ở đây)
    navigate('/');
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Đăng Nhập</h2>
      
      {/* Hiển thị lỗi rõ ràng */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl font-medium animate-pulse">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2 pl-2">Tài khoản (Email / SĐT)</label>
          <input 
            type="text" 
            placeholder="Nhập email hoặc số điện thoại..." 
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 px-5 text-xl text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors placeholder-gray-400"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 pl-2">Mật khẩu</label>
          <input 
            type="password" 
            placeholder="Nhập mật khẩu..." 
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 px-5 text-xl text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors placeholder-gray-400"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 rounded-2xl shadow-md transition-all mt-4"
        >
          Vào Khám Ngay
        </button>
      </form>

      <div className="mt-8 text-center text-gray-600 text-lg">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Đăng ký mới
        </Link>
      </div>
    </div>
  );
};

export default Login;