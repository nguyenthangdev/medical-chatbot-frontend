/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, KeyRound, Loader2, Mail, Save, ShieldAlert, ShieldUser, UserRound } from "lucide-react";
import { createAccountAPI } from "../../../apis/Admin/account.api";
import { getRolesAPI } from "../../../apis/Admin/role.api";
import { useAuth } from '../../../contexts/Admin/AdminAuthContext';
import PasswordStrength from "../../../components/Client/PasswordStrength";

export default function AccountCreate() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const { user, isLoading } = useAuth();
    const { 
        register, 
        handleSubmit, 
        control,
        formState: { errors } 
    } = useForm({
        defaultValues: {
            role_id: '',
            status: 'active'
        }
    });
    const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });
    const hasPermission = user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_create');
    useEffect(() => {
        if (!isLoading && !hasPermission) {
            // toast.error("Bạn không có quyền thêm mới Quản trị viên!");
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, hasPermission, navigate]);
    // Gọi API lấy danh sách Role khi vừa vào trang
    useEffect(() => {
        if (isLoading || !hasPermission) return;
        const fetchRoles = async () => {
            try {
                const res = await getRolesAPI({ limit: 100 });
                const filteredRoles = (res.data || []).filter(role => !role.isSystemAdmin);
                setRoles(filteredRoles);
            } catch (error) {
                toast.error("Lỗi tải danh sách nhóm quyền!");
            }
        };
        fetchRoles();
    }, [hasPermission, isLoading]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            await createAccountAPI(data);
            toast.success("Tạo tài khoản thành công!");
            navigate('/admin/accounts');
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi tạo tài khoản!");
        } finally {
            setIsSaving(false);
        }
    };
    if (isLoading) {
        return (
        <div className="max-w-4xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
            <div className="space-y-4">
                <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
                <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
            </div>
        </div>
        );
    }

    if (!hasPermission) {
        return (
        <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <ShieldAlert size={26} />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">Bạn không có quyền truy cập trang này</p>
            <p className="mt-2 text-sm text-slate-500">Hệ thống đang chuyển hướng về trang tổng quan.</p>
        </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate(-1)} 
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        aria-label="Quay lại"
                >
                        <ArrowLeft size={18} />
                </button>
                    <div>
                        <p className="text-sm font-semibold text-sky-700">Tạo tài khoản quản trị</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Thêm quản trị viên mới</h2>
                    </div>
            </div>
            </section>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                
                {/* Full Name */}
                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Họ và tên <span className="text-rose-500">*</span>
                    </label>
                        <div className="relative">
                            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Nhập họ và tên..."
                        {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-sky-200 ${errors.fullName ? 'border-rose-300' : 'border-slate-300 focus:border-sky-400'}`}
                    />
                        </div>
                        {errors.fullName && <p className="mt-2 text-sm font-medium text-rose-600">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Email <span className="text-rose-500">*</span>
                    </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
                                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-sky-200 ${errors.email ? 'border-rose-300' : 'border-slate-300 focus:border-sky-400'}`}
                    />
                        </div>
                        {errors.email && <p className="mt-2 text-sm font-medium text-rose-600">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Mật khẩu <span className="text-rose-500">*</span>
                    </label>
                        <div className="relative">
                            <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="password"
                        placeholder="Ít nhất 8 ký tự, có chữ hoa và chữ số"
                        {...register("password", { 
                            required: "Vui lòng nhập mật khẩu",
                            minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d).+$/,
                                message: "Mật khẩu phải có ít nhất 1 chữ hoa và 1 chữ số"
                            }
                        })}
                                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-sky-200 ${errors.password ? 'border-rose-300' : 'border-slate-300 focus:border-sky-400'}`}
                    />
                        </div>
                        <PasswordStrength password={passwordValue} error={errors.password} />
                </div>

                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Xác nhận mật khẩu <span className="text-rose-500">*</span>
                    </label>
                        <div className="relative">
                            <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu",
                            validate: (value, formValues) => value === formValues.password || "Mật khẩu xác nhận không khớp"
                        })}
                                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-sky-200 ${errors.confirmPassword ? 'border-rose-300' : 'border-slate-300 focus:border-sky-400'}`}
                    />
                        </div>
                        {errors.confirmPassword && <p className="mt-2 text-sm font-medium text-rose-600">{errors.confirmPassword.message}</p>}
                </div>

                {/* Role & Status (Responsive: 1 cột trên mobile, 2 cột trên md) */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Nhóm quyền <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <ShieldUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            {...register("role_id", { required: "Vui lòng chọn nhóm quyền" })}
                                className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
                        >
                            <option value="">-- Chọn nhóm quyền --</option>
                            {roles.map((r) => (
                                <option key={r._id} value={r._id}>{r.title}</option>
                            ))}
                        </select>
                        </div>
                        {errors.role_id && <p className="mt-2 text-sm font-medium text-rose-600">{errors.role_id.message}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</label>
                        <select
                            {...register("status")}
                            className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Đã khóa</option>
                        </select>
                    </div>
                </div>

                {/* Buttons (Responsive: Căn giữa đều hoặc full ngang) */}
                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-8 text-sm font-semibold text-white shadow-sm transition sm:w-auto ${isSaving ? 'cursor-not-allowed bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'}`}
                    >
                        {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                        {isSaving ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-100 px-8 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:w-auto"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </form>
        </div>
    );
}
