// src/components/Admin/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Header() {
    // Gọi hàm logout từ custom hook vừa tạo
    const { logout } = useAuth();

    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-gray-800">Bảng Điều Khiển</h1>

            <div className="flex items-center gap-6">
                <Link to="/admin/my-account" className="text-gray-600 hover:text-blue-600 font-medium">
                    Tài khoản của tôi
                </Link>

                {/* Nút Đăng xuất */}
                <button
                    onClick={logout}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition font-medium"
                >
                    Đăng xuất
                </button>
            </div>
        </header>
    );
}