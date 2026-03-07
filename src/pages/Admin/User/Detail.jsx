import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data giả định gọi từ API: GET /users/{id}
    const mockUser = {
        id: id,
        name: 'Nguyễn Văn A',
        email: 'a@example.com',
        role: 'Bệnh nhân',
        status: 'Hoạt động',
        phone: '0901234567',
        address: 'Hà Nội, Việt Nam',
        createdAt: '15/10/2023'
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black font-semibold">
                        ← Quay lại
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Chi tiết Người dùng #{id}</h2>
                </div>
                <Link to={`/admin/users/${id}/edit`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Chỉnh sửa
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div>
                    <p className="mb-2"><span className="font-semibold w-24 inline-block">Họ Tên:</span> {mockUser.name}</p>
                    <p className="mb-2"><span className="font-semibold w-24 inline-block">Email:</span> {mockUser.email}</p>
                    <p className="mb-2"><span className="font-semibold w-24 inline-block">Số ĐT:</span> {mockUser.phone}</p>
                    <p className="mb-2"><span className="font-semibold w-24 inline-block">Địa chỉ:</span> {mockUser.address}</p>
                </div>
                <div>
                    <p className="mb-2">
                        <span className="font-semibold w-24 inline-block">Vai trò:</span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{mockUser.role}</span>
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold w-24 inline-block">Trạng thái:</span>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{mockUser.status}</span>
                    </p>
                    <p className="mb-2"><span className="font-semibold w-24 inline-block">Ngày tạo:</span> {mockUser.createdAt}</p>
                </div>
            </div>
        </div>
    );
}