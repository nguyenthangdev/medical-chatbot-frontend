// src/components/Client/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full md:w-80 h-full bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm">
      {/* Nút Tạo mới to, rõ ràng */}
      <button 
        onClick={() => navigate('/')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-md text-xl"
      >
        <span className="text-2xl">➕</span> Bắt đầu khám mới
      </button>

      {/* Thanh tìm kiếm */}
      <div className="mt-6 relative">
        <span className="absolute left-4 top-3.5 text-xl">🔍</span>
        <input 
          type="text" 
          placeholder="Tìm lịch sử khám..." 
          className="w-full bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-xl py-3 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
        />
      </div>

      {/* Danh sách lịch sử */}
      <div className="mt-6 flex-1 overflow-y-auto pr-2">
        <h3 className="text-gray-500 font-semibold mb-3 text-base uppercase tracking-wider">Lịch sử tư vấn</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3 transition-colors">
            <span className="text-2xl">💬</span>
            <span className="truncate font-medium text-blue-800">Đau đầu, chóng mặt...</span>
          </button>
          
          <button className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 p-4 rounded-xl flex items-center gap-3 transition-colors">
            <span className="text-2xl">💬</span>
            <span className="truncate font-medium text-gray-700">Tư vấn dinh dưỡng bé...</span>
          </button>
        </div>
      </div>

      {/* Nút Cài đặt & Thông tin hỗ trợ */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
        <button 
          onClick={() => navigate('/settings')}
          className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-lg font-medium transition-colors ${
            location.pathname === '/settings' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span className="text-2xl">⚙️</span> Cài đặt tài khoản
        </button>

        <div className="text-center text-sm text-gray-400 mt-2">
          <p>🏥 Hệ thống Y tế Bot</p>
          <p>Hỗ trợ: 1900 xxxx</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;