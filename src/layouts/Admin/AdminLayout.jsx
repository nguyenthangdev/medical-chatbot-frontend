import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

export default function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        return localStorage.getItem("admin-theme") || "light";
    });

    const isDarkMode = theme === "dark";

    useEffect(() => {
        localStorage.setItem("admin-theme", theme);
    }, [theme]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
    };

    return (
        <div className={`admin-shell flex h-screen overflow-hidden bg-[#f4f8fb] text-slate-900 ${isDarkMode ? "admin-dark" : "admin-light"}`}>

            {/* Lớp phủ trên mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[2px] md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Thanh điều hướng */}
            <Sidebar
                open={sidebarOpen}
                collapsed={collapsed}
                toggleCollapse={toggleCollapse}
            />

            {/* Khu vực nội dung chính */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* Thanh trên cùng */}
                <Header
                    toggleSidebar={toggleSidebar}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                />

                {/* Nội dung trang */}
                <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">

                    {/* Container giống SaaS layout */}
                    <div className="mx-auto w-full max-w-7xl">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>
    );
}
