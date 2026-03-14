// src/components/Admin/Header.jsx
import React, { useState, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { fetchMyAccountAPI } from "../../apis/Admin/myAccount.api";

export default function Header({ toggleSidebar }) {
    const { logout } = useAuth(); // Chỉ lấy hàm logout từ hook
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Gọi API lấy thông tin tài khoản khi Header vừa load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetchMyAccountAPI();
                // Tùy vào cấu trúc API backend trả về, ví dụ: res.data hoặc res.accountAdmin
                setUser(res.data || res.accountAdmin || res); 
            } catch (error) {
                console.error("Lỗi lấy thông tin user:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-8">

            {/* LEFT */}
            <div className="flex items-center gap-4">
                <button className="md:hidden" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <h1 className="hidden md:block text-lg font-semibold text-gray-800">
                    AdminPage
                </h1>
            </div>

            {/* SEARCH */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
                <Search size={18} className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none px-2 w-full"
                />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">
                <button className="relative text-gray-600 hover:text-black">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                        3
                    </span>
                </button>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2"
                    >
                        <img
                            src={"https://i.pravatar.cc/40"} // Nếu có avatar từ DB thì dùng, không thì lấy mặc định
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="hidden md:block text-sm font-medium">
                            {/* Hiển thị fullName hoặc email tùy bạn */}
                            {user?.fullName || user?.name || "Admin"}
                        </span>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg z-50">
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}