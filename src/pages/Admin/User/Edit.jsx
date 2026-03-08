import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: 'Nguyễn Văn A',
            email: 'a@example.com',
            role: 'patient',
            status: 'active'
        }
    });

    const onSubmit = (data) => {
        console.log(`Cập nhật user ${id}:`, data);
        // TODO: Gọi API PUT /users/{id}
        navigate(`/admin/users/${id}`);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Chỉnh sửa Người dùng #{id}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Họ Tên</label>
                    <input type="text" {...register('name')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input type="email" {...register('email')} className="w-full px-3 py-2 border rounded-lg bg-gray-100 outline-none" readOnly />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Vai trò</label>
                        <select {...register('role')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="patient">Bệnh nhân</option>
                            <option value="doctor">Bác sĩ</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Trạng thái</label>
                        <select {...register('status')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="active">Hoạt động</option>
                            <option value="banned">Đã khóa</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Lưu thay đổi</button>
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                </div>
            </form>
        </div>
    );
}