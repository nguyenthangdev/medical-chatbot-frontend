/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserByIdAPI, updateUserAPI } from "../../../apis/Admin/user.api";

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Kéo dữ liệu cũ của người dùng vào form
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserByIdAPI(id);
                // Đổ dữ liệu vào các ô input
                reset({
                    fullName: res.data.fullName,
                    email: res.data.email,
                    phone: res.data.phone,
                    status: res.data.status
                });
            } catch (error) {
                toast.error("Lỗi khi tải thông tin người dùng!");
                navigate('/admin/users');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [id, reset, navigate]);

    // 2. Xử lý submit form
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Chuẩn bị dữ liệu gửi lên (Thường email không cho sửa)
            const payload = {
                fullName: data.fullName,
                phone: data.phone,
                status: data.status
            };
            
            await updateUserAPI(id, payload);
            toast.success("Cập nhật thông tin thành công!");
            navigate(`/admin/users/${id}`); // Cập nhật xong thì đá về trang Chi tiết
        } catch (error) {
            toast.error("Lỗi khi cập nhật thông tin!");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-6">Đang tải dữ liệu form...</div>;

    return (
        <div className="max-w-2xl bg-white shadow-sm rounded-xl border border-gray-100 p-6 text-gray-800 relative animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 font-medium">
                    &larr; Quay lại
                </button>
                <h2 className="text-2xl font-bold">Chỉnh sửa Người dùng</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email (Readonly) */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        readOnly
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email là thông tin định danh, không thể thay đổi.</p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Số điện thoại</label>
                    <input
                        type="text"
                        {...register("phone")}
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Trạng thái</label>
                    <select
                        {...register("status")}
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="active">Hoạt động (Active)</option>
                        <option value="inactive">Khóa (Inactive)</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-6 py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isSaving && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}