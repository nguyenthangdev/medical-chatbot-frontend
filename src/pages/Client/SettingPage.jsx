// src/pages/Client/SettingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate('/')}
          className="text-3xl text-blue-600 hover:text-blue-800 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 transition-colors"
        >
          ⬅️
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
      </div>

      {/* Nội dung Cài đặt */}
      <div className="max-w-3xl w-full mx-auto p-6 space-y-6 mt-4">
        
        {/* Khối 1: Thông tin cá nhân */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            👤 Thông tin của bạn
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-2">Họ và tên</label>
              <input 
                type="text" 
                defaultValue="Nguyễn Văn A" 
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">Số điện thoại</label>
              <input 
                type="text" 
                defaultValue="0909123456" 
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg bg-gray-100 text-gray-500 outline-none"
                disabled
              />
              <span className="text-sm text-gray-400 mt-1 block">* Số điện thoại không thể thay đổi</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-lg mt-2">
              Lưu thông tin
            </button>
          </div>
        </div>

        {/* Khối 2: Hiển thị */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            🔤 Tùy chỉnh hiển thị
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 font-medium">Kích thước chữ trong đoạn chat</p>
            <div className="flex gap-4">
              <button className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-lg hover:border-blue-500 focus:bg-blue-50 focus:border-blue-500">
                Nhỏ
              </button>
              <button className="flex-1 py-3 border-2 border-blue-600 bg-blue-50 rounded-xl text-lg font-bold text-blue-700">
                Vừa (Đang dùng)
              </button>
              <button className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-xl font-bold hover:border-blue-500 focus:bg-blue-50 focus:border-blue-500">
                To
              </button>
            </div>
          </div>
        </div>

        {/* Khối 3: Đăng xuất */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <button className="w-full bg-red-100 text-red-600 hover:bg-red-200 font-bold py-4 rounded-xl text-xl flex items-center justify-center gap-2 transition-colors">
            <span>🚪</span> Đăng xuất tài khoản
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingPage;