import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function AccountEdit() {
    const navigate = useNavigate();
    // Giả lập dữ liệu fetch về
    const { register, handleSubmit } = useForm({
        defaultValues: { name: 'Admin Tối Cao', email: 'admin@medicalbot.com' }
    });

    const onSubmit = (data) => {
        console.log('Cập nhật:', data);
        navigate('/admin/my-account'); // Lưu xong quay về trang Detail
    };

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa tài khoản</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Họ Tên</label>
                    <input type="text" {...register('name')} className="w-full px-3 py-2 border rounded-lg border-gray-300" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input type="email" {...register('email')} className="w-full px-3 py-2 border rounded-lg border-gray-300 bg-gray-100" readOnly />
                    <p className="text-xs text-gray-500 mt-1">Không thể thay đổi email.</p>
                </div>
                <div className="flex gap-4 mt-6">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Lưu thay đổi</button>
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                </div>
            </form>
        </div>
    );
}