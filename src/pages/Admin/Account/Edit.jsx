import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài và setup react-toastify

// Import 2 API
import { updateMyAccountAPI, fetchMyAccountAPI } from "../../../apis/Admin/myAccount.api";

export default function AccountEdit() {
    const navigate = useNavigate();

    // Lấy thêm hàm 'reset' từ useForm để chủ động nạp dữ liệu vào form
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState(true); // Loading khi kéo data
    const [isSaving, setIsSaving] = useState(false);  // Loading khi bấm Save

    // 1. GỌI API ĐỂ ĐỔ DỮ LIỆU CŨ VÀO FORM
    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const res = await fetchMyAccountAPI();
                const profile = res.accountAdmin || res.data || res;
                
                // Nạp dữ liệu lấy được vào Form
                reset({
                    name: profile.fullName || profile.name,
                    email: profile.email,
                });
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
                toast.error("Không thể tải thông tin tài khoản!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccountDetails();
    }, [reset]);

    // 2. GỌI API KHI BẤM NÚT SAVE
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Map dữ liệu form (name) sang field Backend cần (fullName)
            const payload = {
                fullName: data.name
            };

            await updateMyAccountAPI(payload);
            toast.success("Cập nhật thông tin thành công!");
            
            // Cập nhật xong thì quay về trang Detail
            navigate("/admin/my-account");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi khi cập nhật thông tin!";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Giao diện Loading chờ lấy dữ liệu
    if (isLoading) {
        return (
            <div className="max-w-2xl bg-white shadow-md rounded-xl p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-xl p-6 text-gray-800 transition-all duration-300">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-blue-600 transition flex items-center gap-1 font-medium"
                >
                    &larr; Back
                </button>
                <h2 className="text-2xl font-semibold">
                    Edit Account
                </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Vui lòng nhập họ tên" })}
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Nhập họ và tên..."
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email (Readonly) */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        readOnly
                        className="w-full px-4 py-2.5 border rounded-lg border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed select-none"
                    />
                    <p className="text-xs text-orange-500 mt-1.5 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Email cannot be changed for security reasons.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 mt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-6 py-2.5 rounded-lg text-white font-medium transition ${
                            isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-sm'
                        }`}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                    >
                        Cancel
                    </button>
                </div>

            </form>

        </div>
    );
}