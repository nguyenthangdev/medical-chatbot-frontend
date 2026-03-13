import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { registerAdminAPI } from "../../../apis/Admin/auth.api";

export default function Register() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password", "");
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    // States quản lý trạng thái gọi API
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [apiSuccess, setApiSuccess] = useState(""); // Thêm state cho thông báo thành công

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError(""); 
        setApiSuccess(""); // Reset trạng thái

        try {
            const payload = {
                fullName: data.name,
                email: data.email,
                password: data.password
            };

            await registerAdminAPI(payload);

            // 1. Hiển thị thông báo thành công đẹp mắt
            setApiSuccess("🎉 Đăng ký thành công! Đang chuyển hướng đến đăng nhập...");
            
            // 2. Tự động chuyển trang sau 2 giây (để người dùng kịp đọc chữ)
            setTimeout(() => {
                navigate("/admin/login");
            }, 2000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi kết nối đến server!";
            setApiError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4
      bg-gradient-to-br from-blue-500 via-teal-400 to-green-400
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
            <div
                className="w-full max-w-md backdrop-blur-lg bg-white/40 dark:bg-gray-800/60
        border border-white/40 dark:border-gray-700
        shadow-2xl rounded-2xl p-8"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md mb-3 animate-pulse">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8 10h.01M16 10h.01M9 16h6
                M12 2a10 10 0 00-7.07 17.07L3 22l2.93-1.93A10 10 0 1012 2z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        Medical Admin
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Create an administrator account
                    </p>
                </div>

                {/* KHU VỰC HIỂN THỊ THÔNG BÁO (LỖI HOẶC THÀNH CÔNG) */}
                {apiError && (
                    <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm text-sm text-center animate-bounce">
                        ⚠️ {apiError}
                    </div>
                )}
                {apiSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-800 rounded shadow-sm text-sm text-center font-medium animate-pulse">
                        {apiSuccess}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            {...register("name", {
                                required: "Name is required"
                            })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300
              bg-white/80 text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-400
              dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300
              bg-white/80 text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-400
              dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Minimum 6 characters"
                                    }
                                })}
                                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300
                bg-white/80 text-gray-900 placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-400
                dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 h-full px-5 flex items-center justify-center bg-gray-900 rounded-r-xl"
                            >
                                {showPassword ? <EyeOff size={20} className="text-white" /> : <Eye size={20} className="text-white" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: value => value === password || "Passwords do not match"
                                })}
                                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300
                bg-white/80 text-gray-900 placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-400
                dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-0 top-0 h-full px-5 flex items-center justify-center bg-gray-900 rounded-r-xl"
                            >
                                {showConfirm ? <EyeOff size={20} className="text-white" /> : <Eye size={20} className="text-white" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading || apiSuccess} // Khóa nút khi đang load hoặc đã thành công
                        className={`w-full text-white font-semibold py-2.5 rounded-lg shadow-md transition ${
                            isLoading || apiSuccess ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isLoading ? 'Đang xử lý...' : apiSuccess ? 'Thành công!' : 'Register'}
                    </button>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link to="/admin/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}