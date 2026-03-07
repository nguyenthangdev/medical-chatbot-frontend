// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from '../components/Admin/Header';
// import Sidebar from '../components/Admin/Sidebar'; // Nếu bạn tách Sidebar ra file riêng thì import ở đây

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar giả lập (Bạn có thể tách ra file riêng tương tự Header) */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">MedBot Admin</h2>
                </div>
                <nav className="flex-1 flex flex-col gap-1 p-4">
                    <Link to="/admin/dashboard" className="p-2 hover:bg-gray-700 rounded transition">Tổng quan</Link>
                    <Link to="/admin/users" className="p-2 hover:bg-gray-700 rounded transition">Người dùng</Link>
                    <Link to="/admin/conversations" className="p-2 hover:bg-gray-700 rounded transition">Hội thoại</Link>
                    <Link to="/admin/messages" className="p-2 hover:bg-gray-700 rounded transition">Tin nhắn</Link>
                    <Link to="/admin/settings" className="p-2 hover:bg-gray-700 rounded transition">Cài đặt</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Đưa Component Header vào đây */}
                <Header />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}