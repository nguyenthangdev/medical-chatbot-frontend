import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Activity,
    LayoutDashboard,
    Users,
    MessageCircle,
    Mail,
    Settings,
    User,
    ChevronLeft,
    ChevronRight,
    ShieldUser,
    Shield,
    Key,
    Stethoscope
} from "lucide-react";
import { useAuth } from "../../contexts/Admin/AdminAuthContext";

export default function Sidebar({ open, collapsed, toggleCollapse }) {

    const location = useLocation();
    const { user } = useAuth();
    
    const userPermissions = user?.role_id?.permissions || [];
    const isSystemAdmin = user?.role_id?.isSystemAdmin === true;

    const hasPermission = (requiredPermission) => {
        if (!requiredPermission) return true;
        
        if (isSystemAdmin) return true;
        
        return userPermissions.includes(requiredPermission);
    };
    
    const menu = [
        { name: "Tổng quan", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Tài khoản người dùng", path: "/admin/users", icon: <Users size={20} />, permission: "users_view" },
        { name: "Tài khoản quản trị", path: "/admin/accounts", icon: <ShieldUser size={20} />, permission: "accounts_view" },
        { name: "Cuộc hội thoại", path: "/admin/conversations", icon: <MessageCircle size={20} />, permission: "conversations_view" },
        { name: "Tin nhắn", path: "/admin/messages", icon: <Mail size={20} />, permission: "chats_view" },
        { name: "Nhóm quyền", path: "/admin/roles", icon: <Shield size={20} />, permission: "roles_view" },
        { name: "Phân quyền", path: "/admin/permissions", icon: <Key size={20} />, permission: "roles_permissions" },
        { name: "Cài đặt", path: "/admin/settings", icon: <Settings size={20} />, permission: "settings_edit" },
        { name: "Thông tin cá nhân", path: "/admin/my-profile", icon: <User size={20} /> }
    ];

    const filteredMenu = menu.filter(item => hasPermission(item.permission));

    return (
        <aside
            className={`
            fixed z-40 flex h-full flex-col
            bg-white/95 text-slate-600 shadow-[16px_0_40px_rgba(15,23,42,0.06)]
            backdrop-blur transition-all duration-300 md:static
            ${collapsed ? "w-20" : "w-64"}
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >

            {/* Logo */}
            <div className="flex h-20 items-center justify-between px-4">

                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                            <Stethoscope size={22} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-950">
                                Quản trị MedBot
                            </h2>
                            <p className="text-xs font-medium text-slate-400">
                                Nền tảng y tế AI
                            </p>
                        </div>
                    </div>
                )}

                {collapsed && (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                        <Stethoscope size={22} />
                    </div>
                )}

                <button
                    onClick={toggleCollapse}
                    className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-sky-50 hover:text-sky-700 md:flex"
                    aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">

                {filteredMenu.map((item) => {
                    // Logic active (Xử lý riêng trang Nhóm quyền nếu đường dẫn Phân quyền có thể trùng gốc)
                    const active = item.path === "/admin/roles"
                        ? location.pathname === "/admin/roles" || location.pathname.includes("/admin/roles/create") || location.pathname.includes("/admin/roles/edit")
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.name : undefined}
                            className={`
                            group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition
                            ${collapsed ? "justify-center" : ""}
                            ${active
                                ? "bg-sky-600 text-white shadow-[0_10px_24px_rgba(2,132,199,0.22)]"
                                : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                            }
                        `}
                        >

                            <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-sky-600"}`}>
                                {item.icon}
                            </span>

                            {!collapsed && (
                                <span className="truncate">
                                    {item.name}
                                </span>
                            )}

                        </Link>
                    );
                })}

            </nav>

            <div className="p-3">
                <div className={`rounded-2xl bg-emerald-50 p-3 text-emerald-700 ${collapsed ? "flex justify-center" : ""}`}>
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                            <Activity size={18} />
                        </span>
                        {!collapsed && (
                            <div>
                                <p className="text-sm font-semibold">Hệ thống ổn định</p>
                                <p className="text-xs text-emerald-600/80">Tất cả dịch vụ đang hoạt động</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </aside>
    );
}
