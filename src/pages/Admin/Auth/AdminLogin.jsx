import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { loginAdminAPI } from "../../../apis/Admin/auth.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext";

export default function AdminLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const response = await loginAdminAPI({
                email: data.email,
                password: data.password
            });
            
            if (response.accountAdmin || response.data) {
                toast.success("🎉 Đăng nhập thành công!");
                await refreshUser(); 
                
                setTimeout(() => {
                    navigate("/admin/dashboard", { replace: true });
                }, 1500);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi kết nối đến server!";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 
    bg-gradient-to-br from-blue-500 via-teal-400 to-green-400 
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

            <div className="w-full max-w-md backdrop-blur-lg bg-white/40 dark:bg-gray-800/60
      border border-white/40 dark:border-gray-700
      shadow-2xl rounded-2xl p-8 transition">

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
                        Medical Chatbot
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Đăng nhập Quản trị viên
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email", {
                                required: "Vui lòng nhập email",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Email không hợp lệ"
                                }
                            })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300
              bg-white/80 text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-400
              dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                {...register("password", {
                                    required: "Vui lòng nhập mật khẩu"
                                })}
                                className="w-full px-4 py-3 pr-16
                rounded-xl border border-gray-300
                bg-white/80 text-gray-900
                placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-400
                dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 h-full px-5
                flex items-center justify-center
                bg-gray-900 dark:bg-gray-900
                rounded-r-xl"
                            >
                                {showPassword ? (
                                    <Eye size={20} className="text-gray-300" />
                                ) : (
                                    <EyeOff size={20} className="text-gray-300" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading} 
                        className={`w-full text-white font-semibold py-2.5 rounded-lg shadow-md transition ${
                            isLoading 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-6">
                    Chưa có tài khoản?{" "}
                    <Link
                        to="/admin/register"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Đăng ký ngay
                    </Link>
                </p>

            </div>
        </div>
    );
}