import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Settings, User, LogOut, ChevronDown, ShieldCheck, Moon, Sun } from "lucide-react";
import { useAuth } from "../../contexts/Admin/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar, isDarkMode, toggleTheme }) {
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
        <header className="relative z-[100] flex h-20 shrink-0 items-center justify-between border-b border-slate-300/80 bg-white/90 px-4 shadow-sm backdrop-blur md:px-8">

            <div className="flex items-center gap-4">
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 md:hidden"
                    onClick={toggleSidebar}
                    aria-label="Mở menu quản trị"
                >
                    <Menu size={22} />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-slate-950 md:text-xl">
                            Trang quản trị
                        </h1>
                        <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                            Đang hoạt động
                        </span>
                    </div>
                    <p className="hidden text-sm text-slate-500 sm:block">
                        Quản lý hệ thống AI Medical Chatbot
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 lg:flex">
                    <ShieldCheck size={17} className="text-sky-600" />
                    Phiên quản trị bảo mật
                </div>

                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
                    <Bell size={20} />
                    <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                        3
                    </span>
                </button>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    aria-label={isDarkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
                    title={isDarkMode ? "Giao diện sáng" : "Giao diện tối"}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 rounded-2xl bg-white py-1.5 pl-1.5 pr-2.5 shadow-sm transition hover:bg-sky-50"
                    >
                        <img
                            src={user?.avatar || "/default-avatar.png"}
                            alt="avatar"
                            className="h-9 w-9 rounded-xl object-cover ring-2 ring-white"
                        />
                        <div className="hidden max-w-[150px] text-left md:block">
                            <span className="block truncate text-sm font-semibold text-slate-800">
                                {user?.fullName || user?.name || "Quản trị viên"}
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                                Quản trị viên
                            </span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`hidden text-slate-400 transition-transform duration-200 md:block ${profileOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 z-[120] mt-3 w-72 overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">

                            {/* User Info */}
                            <div className="bg-slate-50 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user?.avatar || "/default-avatar.png"}
                                        alt="avatar"
                                        className="h-11 w-11 rounded-2xl object-cover"
                                    />
                                    <div className="overflow-hidden">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {user?.fullName || user?.name || "Quản trị viên"}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {user?.email || "admin@example.com"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/admin/my-profile");
                                    }}
                                    className="admin-profile-menu-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
                                >
                                    <User size={16} className="text-slate-400" />
                                    Thông tin cá nhân
                                </button>

                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/admin/settings");
                                    }}
                                    className="admin-profile-menu-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
                                >
                                    <Settings size={16} className="text-slate-400" />
                                    Cài đặt
                                </button>
                            </div>

                            {/* Divider + Logout */}
                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="admin-profile-menu-item admin-profile-menu-danger flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
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
