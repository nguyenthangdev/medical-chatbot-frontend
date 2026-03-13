// src/layouts/Client/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-white">
        
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M11.99 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75zM9 11.25a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5a.75.75 0 00-1.5 0v1.5H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Bác Sĩ Ảo</h1>
          <p className="text-gray-500 mt-1 text-center">Chăm sóc sức khỏe gia đình bạn</p>
        </div>

        {/* Nơi render Login hoặc Register */}
        <Outlet />

      </div>
    </div>
  );
};

export default AuthLayout;