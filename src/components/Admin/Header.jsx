// src/components/Admin/Header.jsx

import React, { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Header({ toggleSidebar }) {

    const { logout, getUser } = useAuth();
    const user = getUser();

    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-8">

            {/* LEFT */}
            <div className="flex items-center gap-4">

                <button
                    className="md:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu size={24} />
                </button>

                {/* Ẩn text khi mobile */}
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
                            src="https://i.pravatar.cc/40"
                            className="w-9 h-9 rounded-full"
                        />

                        <span className="hidden md:block text-sm font-medium">
                            {user?.name || "Admin"}
                        </span>

                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg">

                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
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