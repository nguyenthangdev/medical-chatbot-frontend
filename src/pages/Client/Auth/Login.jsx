import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginClientAPI } from '../../../apis/Client/auth.api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.identifier.trim()) return setError('Bác/cháu vui lòng nhập Email hoặc Số điện thoại ạ.');
    if (!formData.password) return setError('Bác/cháu chưa nhập mật khẩu.');

    setIsLoading(true);
    try {
      await loginClientAPI(formData);
      setSuccess('Đăng nhập thành công! Đang vào phòng khám...');
      setTimeout(() => navigate('/'), 1500); // Chuyển vào trang chủ chat
    } catch (err) {
      setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Đăng Nhập</h2>
      
      {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl font-medium animate-pulse">⚠️ {error}</div>}
      {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-xl font-medium animate-pulse">✓ {success}</div>}

      <form onSubmit={handleLogin} className="space-y-5">
        {/* ... (Giữ nguyên các input của bạn) ... */}
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
          disabled={isLoading || success}
          className={`w-full text-white font-bold text-xl py-4 rounded-2xl shadow-md transition-all mt-4 ${isLoading || success ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Đang xử lý...' : success ? 'Thành công!' : 'Vào Khám Ngay'}
        </button>
      </form>

      <div className="mt-8 text-center text-gray-600 text-lg">
        Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold hover:underline">Đăng ký mới</Link>
      </div>
    </div>
  );
};

export default Login;