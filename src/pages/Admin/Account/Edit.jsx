/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAccountByIdAPI, updateAccountAPI } from "../../../apis/Admin/account.api";

export default function AccountEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 1. KÉO DỮ LIỆU CŨ VÀO FORM
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await getAccountByIdAPI(id);
                // Reset form bằng dữ liệu thật
                reset({
                    fullName: res.account.fullName,
                    email: res.account.email,
                    role: res.account.role,
                    status: res.account.status
                });
            } catch (error) {
                toast.error("Lỗi khi tải dữ liệu tài khoản!");
                navigate('/admin/accounts');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAccount();
    }, [id, reset, navigate]);

    // 2. LƯU DỮ LIỆU MỚI
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Chỉ gửi lên những trường cần update (bỏ email đi vì không cho sửa)
            const payload = {
                fullName: data.fullName,
                role: data.role,
                status: data.status
            };
            
            await updateAccountAPI(id, payload);
            toast.success("Cập nhật tài khoản thành công!");
            navigate(`/admin/accounts/${id}`); // Xong thì về trang detail
        } catch (error) {
            toast.error("Lỗi khi cập nhật tài khoản!");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-6">Đang tải dữ liệu form...</div>;

    return (
        <div className="max-w-2xl bg-white shadow-sm rounded-xl border border-gray-100 p-6 text-gray-800">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 font-medium cursor-pointer">
                    &larr; Back
                </button>
                <h2 className="text-2xl font-bold">Chỉnh sửa tài khoản</h2>
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
                    <p className="text-xs text-gray-400 mt-1">Email là cố định, không thể thay đổi.</p>
                </div>

                {/* Role & Status */}
                <div className="grid grid-cols-2 gap-4">
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

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-6 py-2.5 rounded-lg text-white font-medium transition ${isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
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