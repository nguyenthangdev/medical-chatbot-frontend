// src/components/Client/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import API để lấy tên người dùng hiển thị lên Sidebar
import { getMyAccountAPI } from '../../apis/Client/myAccount.api'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Gọi API lấy thông tin user để hiển thị ở góc dưới
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMyAccountAPI();
        setUser(res.user);
      } catch (error) {
        // Nếu lỗi (chưa đăng nhập), interceptor đã tự lo việc đá ra login
        console.error("Lỗi tải thông tin user ở Sidebar:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full md:w-80 h-full bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm relative">
      
      {/* Nút Tạo mới to, rõ ràng */}
      <button 
        onClick={() => navigate('/')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl flex items-center gap-3 transition-all shadow-md text-xl"
      >
        <span className="text-2xl bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">+</span> 
        Bắt đầu khám mới
      </button>

      {/* Thanh tìm kiếm */}
      <div className="mt-6 relative">
        <span className="absolute left-4 top-3.5 text-xl">🔍</span>
        <input 
          type="text" 
          placeholder="Tìm lịch sử khám..." 
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 pl-12 pr-4 text-base focus:outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-400"
        />
      </div>

      {/* Danh sách lịch sử */}
      <div className="mt-6 flex-1 overflow-y-auto pr-2">
        <h3 className="text-gray-400 font-bold mb-3 text-xs uppercase tracking-wider ml-1">Hôm nay</h3>
        
        <div className="space-y-2">
          <button className="w-full text-left hover:bg-gray-100 p-3 rounded-xl flex items-center gap-3 transition-colors group">
            <span className="text-gray-400 group-hover:text-blue-500">💬</span>
            <span className="truncate text-[15px] font-medium text-gray-700">Đau đầu, chóng mặt kéo dài...</span>
          </button>
          
          <button className="w-full text-left hover:bg-gray-100 p-3 rounded-xl flex items-center gap-3 transition-colors group">
            <span className="text-gray-400 group-hover:text-blue-500">💬</span>
            <span className="truncate text-[15px] font-medium text-gray-700">Tư vấn dinh dưỡng cho bé 2 tuổi</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PHẦN BOTTOM STYLE CHATGPT (Avatar + Name + Cài đặt) */}
      {/* ============================================================ */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <button 
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
            location.pathname === '/settings' 
              ? 'bg-blue-50 border border-blue-100' 
              : 'hover:bg-gray-100 border border-transparent'
          }`}
        >
          {/* Avatar - Lấy chữ cái đầu */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Tên & Loại tài khoản */}
          <div className="flex-1 flex flex-col items-start overflow-hidden">
            <span className="text-gray-800 font-semibold text-[15px] truncate w-full text-left">
              {user?.fullName || "Đang tải..."}
            </span>
            <span className="text-gray-500 text-xs">
              Tài khoản miễn phí
            </span>
          </div>

          {/* Icon bánh răng hoặc 3 chấm */}
          <div className="text-gray-400 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.894 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;