import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/Admin/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar }) {
    const { logout, user } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        await logout();
    };
    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-8">

            <div className="flex items-center gap-4">
                <button className="md:hidden" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <h1 className="hidden md:block text-lg font-semibold text-gray-800">
                    Trang quản trị
                </h1>
            </div>

            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
                <Search size={18} className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none px-2 w-full"
                />
            </div>

            <div className="flex items-center gap-5">
                <button className="relative text-gray-600 hover:text-black">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                        3
                    </span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2"
                    >
                        <img
                            src={user?.avatar || "/default-avatar.png"}
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="hidden md:block text-sm font-medium">
                            {user?.fullName || user?.name || "Admin"}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`hidden md:block text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">

                            {/* User Info */}
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user?.avatar || "/default-avatar.png"}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {user?.fullName || user?.name || "Admin"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email || "admin@example.com"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/admin/my-profile");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User size={16} className="text-gray-500" />
                                    Thông tin cá nhân
                                </button>

                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/admin/settings");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings size={16} className="text-gray-500" />
                                    Cài đặt
                                </button>
                            </div>

                            {/* Divider + Logout */}
                            <div className="border-t border-gray-100 py-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}