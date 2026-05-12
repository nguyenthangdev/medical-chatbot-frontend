import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Client/Sidebar';
import { useChat } from '../../hooks/Client/useChat';
import { useAuth } from '../../contexts/Client/ClientAuthContext';

const ClientLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('chatFontSize') || 'medium');
  const { user } = useAuth();
  
  // 1. TẠO BIẾN TRIGGER
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  // 2. TRUYỀN HÀM TĂNG BIẾN TRIGGER VÀO useChat
  const { 
    messages, 
    loading, 
    conversationId, 
    sendMessage, 
    loadConversation, 
    clearChat 
  } = useChat(
    user?._id, 
    () => setRefreshSidebar(prev => prev + 1) // Mỗi lần chat xong, biến này sẽ thay đổi
  );

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 overflow-hidden relative">
      <div className="hidden md:block z-10 shadow-lg">
        <Sidebar 
          currentConversationId={conversationId}
          onSelectConversation={(convId) => loadConversation(convId)}
          onNewChat={() => clearChat()}
          refreshTrigger={refreshSidebar} // 3. TRUYỀN XUỐNG SIDEBAR
        />
      </div>

      <div 
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div className={`md:hidden fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Nhớ cập nhật luôn cho Sidebar mobile */}
        <Sidebar 
          currentConversationId={conversationId}
          onSelectConversation={(convId) => {
            loadConversation(convId);
            setIsMobileMenuOpen(false); // Đóng menu mobile sau khi chọn
          }}
          onNewChat={() => {
            clearChat();
            setIsMobileMenuOpen(false);
          }}
          refreshTrigger={refreshSidebar}
        />
        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600">X</button>
      </div>
      
      <main className="flex-1 flex flex-col h-full relative">
        <Outlet context={{ isMobileMenuOpen, setIsMobileMenuOpen, fontSize, setFontSize, messages, loading, sendMessage }} />
      </main>
    </div>
  );
};

export default ClientLayout;