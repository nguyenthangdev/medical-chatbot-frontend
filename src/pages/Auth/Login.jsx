import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password", "");

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        console.log("Login data:", data);
    };

    /* Password strength */
    const getStrength = () => {
        if (!password) return 0;
        if (password.length < 6) return 1;
        if (password.length < 8) return 2;
        if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return 4;
        return 3;
    };

    const strength = getStrength();

    const strengthColor = [
        "bg-transparent",
        "bg-red-500",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-green-500"
    ];

    const strengthText = [
        "",
        "Weak",
        "Fair",
        "Good",
        "Strong"
    ];

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 
    bg-gradient-to-br from-blue-500 via-teal-400 to-green-400 
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

            {/* Card */}
            <div className="w-full max-w-md backdrop-blur-lg bg-white/40 dark:bg-gray-800/60
      border border-white/40 dark:border-gray-700
      shadow-2xl rounded-2xl p-8 transition">

                {/* Header */}
                <div className="flex flex-col items-center mb-6">

                    {/* Animated chatbot icon */}
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
                        Admin Login
                    </p>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
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

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required"
                                })}
                                className="w-full px-4 py-3 pr-16
                rounded-xl border border-gray-300
                bg-white/80 text-gray-900
                placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-400
                dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />

                            {/* Eye button */}
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

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white
            font-semibold py-2.5 rounded-lg shadow-md transition"
                    >
                        Login
                    </button>

                </form>

                {/* Register link */}
                <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}

