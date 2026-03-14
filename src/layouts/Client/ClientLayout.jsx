import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Client/Sidebar';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';

const ClientLayout = () => {
  // State quản lý việc ẩn/hiện Sidebar trên Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 1. Khởi tạo state cỡ chữ, lấy từ localStorage lên (mặc định là 'medium')
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('chatFontSize') || 'medium';
  });
  const { user } = useAuth()
  console.log("user: ", user)
  const { messages, loading, sendMessage, loadConversation, clearChat } = useChat(user?._id)

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 overflow-hidden relative">
      
      {/* 1. SIDEBAR DESKTOP (Luôn hiện trên màn hình lớn, ẩn trên Mobile) */}
      <div className="hidden md:block z-10 shadow-lg">
        <Sidebar 
        onSelectConversation={(convId) => loadConversation(convId)}
        onNewChat={() => clearChat()}
        />
      </div>

      {/* 2. OVERLAY NỀN ĐEN MỜ (Dành cho Mobile khi mở menu) */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileMenuOpen(false)} // Bấm ra ngoài nền đen để đóng
      ></div>

      {/* 3. SIDEBAR MOBILE (Trượt từ trái sang) */}
      <div 
        className={`md:hidden fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
        
        {/* Nút X để đóng Sidebar */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Vùng nội dung chính */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Truyền hàm mở Menu xuống cho các trang con (ChatPage) */}
        <Outlet context={{ 
          isMobileMenuOpen, 
          setIsMobileMenuOpen, 
          fontSize,          // <--- Truyền state xuống
          setFontSize,        // <--- Truyền hàm đổi state xuống
          messages, 
          loading, 
          sendMessage
        }} />
      </main>
    </div>
  );
};

export default ClientLayout;