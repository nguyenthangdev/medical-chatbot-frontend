import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* Outlet là nơi component con (Login/Register) sẽ được render ra */}
            <Outlet />
        </div>
    );
}