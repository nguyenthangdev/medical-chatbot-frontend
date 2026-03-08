import React from 'react';
import DataTable from '../../../components/Admin/DataTable';

export default function UserIndex() {
    // Cấu hình cột
    const userColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Họ Tên', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Vai trò', accessor: 'role' },
        { header: 'Trạng thái', accessor: 'status' },
    ];

    // Dữ liệu giả định
    const mockUsers = [
        { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Bệnh nhân', status: 'Hoạt động' },
        { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Bác sĩ', status: 'Hoạt động' },
        { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'Bệnh nhân', status: 'Đã khóa' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    + Thêm User Mới
                </button>
            </div>

            <DataTable title="Danh sách người dùng" columns={userColumns} data={mockUsers} />
        </div>
    );
}