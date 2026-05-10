import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    MessageCircle,
    Mail,
    Settings,
    User,
    ChevronLeft,
    ChevronRight,
    ShieldUser
} from "lucide-react";
export default function Sidebar({ open, collapsed, toggleCollapse }) {

    const location = useLocation();

    const menu = [
        { name: "Tổng quan", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Người dùng", path: "/admin/users", icon: <Users size={20} /> },
        { name: "Tài khoản", path: "/admin/accounts", icon: <ShieldUser size={20} /> },
        { name: "Cuộc trò chuyện", path: "/admin/conversations", icon: <MessageCircle size={20} /> },
        { name: "Tin nhắn", path: "/admin/messages", icon: <Mail size={20} /> },
        { name: "Cài đặt", path: "/admin/settings", icon: <Settings size={20} /> },
        { name: "Thông tin cá nhân", path: "/admin/my-profile", icon: <User size={20} /> }
    ];

    return (
        <aside
            className={`
            bg-gray-900 text-gray-200 h-full fixed md:static z-40
            transition-all duration-300
            ${collapsed ? "w-20" : "w-64"}
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >

            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">

                {!collapsed && (
                    <h2 className="text-lg font-bold text-white">
                        MedBot
                    </h2>
                )}

                <button
                    onClick={toggleCollapse}
                    className="text-gray-400 hover:text-white"
                >
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>

            </div>

            {/* Menu */}
            <nav className="p-3 space-y-1">

                {menu.map((item) => {

                    const active = location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg transition
                            ${active ? "bg-blue-600 text-white" : "hover:bg-gray-800"}
                        `}
                        >

                            {item.icon}

                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            )}

                        </Link>
                    );
                })}

            </nav>

        </aside>
    );
}