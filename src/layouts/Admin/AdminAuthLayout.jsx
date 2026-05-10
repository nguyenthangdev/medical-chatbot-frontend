import { Outlet } from 'react-router-dom';

export default function AdminAuthLayout() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Outlet />
        </div>
    );
}