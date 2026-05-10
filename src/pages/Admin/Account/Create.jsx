import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAccountAPI } from "../../../apis/Admin/account.api";

export default function AccountCreate() {
    const navigate = useNavigate();
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            role: 'Admin',
            status: 'active'
        }
    });

    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            await createAccountAPI(data);
            toast.success("Tạo tài khoản thành công!");
            navigate('/admin/accounts');
        } catch (error) {
            console.error("Lỗi tạo tài khoản:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white shadow-sm rounded-xl border border-gray-100 p-4 md:p-6 text-gray-800">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-gray-500 hover:text-blue-600 font-medium self-start sm:self-auto"
                >
                    &larr; Quay lại
                </button>
                <h2 className="text-xl md:text-2xl font-bold">Thêm mới Quản trị viên</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập họ và tên..."
                        {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        {...register("email", { 
                            required: "Vui lòng nhập email",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email không hợp lệ"
                            }
                        })}
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Ít nhất 6 ký tự"
                        {...register("password", { 
                            required: "Vui lòng nhập mật khẩu",
                            minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                        })}
                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Role & Status (Responsive: 1 cột trên mobile, 2 cột trên md) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Vai trò</label>
                        <select
                            {...register("role")}
                            className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                            <option value="Super Admin">Super Admin</option>
                        </select>
                    </div>

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
                </div>

                {/* Buttons (Responsive: Căn giữa đều hoặc full ngang) */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full sm:w-auto px-8 py-2.5 rounded-lg text-white font-medium transition flex justify-center items-center gap-2 ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSaving && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
                        {isSaving ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition text-center"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </form>
        </div>
    );
}