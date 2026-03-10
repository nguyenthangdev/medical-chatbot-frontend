import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

export default function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                open={sidebarOpen}
                collapsed={collapsed}
                toggleCollapse={toggleCollapse}
            />

            {/* Main area */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Header */}
                <Header toggleSidebar={toggleSidebar} />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">

                    {/* Container giống SaaS layout */}
                    <div className="w-full px-2">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>
    );
}