import React from 'react';
import { Link } from 'react-router-dom';

export default function AccountDetail() {
    const mockProfile = { name: 'Admin Tối Cao', email: 'admin@medicalbot.com', role: 'Super Admin', joined: '01/01/2024' };

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Thông tin tài khoản</h2>
                <Link to="/admin/my-account/edit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Chỉnh sửa</Link>
            </div>
            <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold w-32 inline-block">Họ Tên:</span> {mockProfile.name}</p>
                <p><span className="font-semibold w-32 inline-block">Email:</span> {mockProfile.email}</p>
                <p><span className="font-semibold w-32 inline-block">Vai trò:</span> {mockProfile.role}</p>
                <p><span className="font-semibold w-32 inline-block">Ngày tham gia:</span> {mockProfile.joined}</p>
            </div>
        </div>
    );
}