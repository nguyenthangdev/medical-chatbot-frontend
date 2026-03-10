import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Client/Sidebar';

const ClientLayout = () => {
  return (
    /* Dùng dải màu Gradient Xanh Y Tế cho Background tổng thể */
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 overflow-hidden">
      
      {/* Sidebar (Cột bên trái) giữ màu trắng để tách biệt nổi bật */}
      <div className="hidden md:block z-10 shadow-lg">
        <Sidebar />
      </div>
      
      {/* Vùng nội dung chính */}
      <main className="flex-1 flex flex-col h-full relative">
        <Outlet /> 
      </main>
    </div>
  );
};

export default ClientLayout;