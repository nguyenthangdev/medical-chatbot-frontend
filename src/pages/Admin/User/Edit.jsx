/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Mail, Phone, Save, ShieldAlert, UserRound } from "lucide-react";
import { getUserByIdAPI, updateUserAPI } from "../../../apis/Admin/user.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext"; // THÊM IMPORT

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    const [isFetchingDetail, setIsFetchingDetail] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const { user: adminUser, isLoading: authLoading } = useAuth(); // LẤY AUTH VÀ ĐỔI TÊN BIẾN

    // 1. KIỂM TRA QUYỀN (users_edit)
    const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('users_edit');

    useEffect(() => {
        if (!authLoading && !hasPermission) {
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [authLoading, hasPermission, navigate]);

    // 2. FETCH DATA KÉO DỮ LIỆU CŨ VÀO FORM
    useEffect(() => {
        if (authLoading || !hasPermission) return;
        const fetchUser = async () => {
            try {
                const res = await getUserByIdAPI(id);
                reset({
                    fullName: res.data.fullName,
                    email: res.data.email,
                    phone: res.data.phone,
                    status: res.data.status
                });
            } catch (error) {
                toast.error("Lỗi khi tải thông tin người dùng!");
                navigate('/admin/dashboard');
            } finally {
                setIsFetchingDetail(false);
            }
        };
        fetchUser();
    }, [id, reset, navigate, authLoading, hasPermission]);

    // 3. LƯU DỮ LIỆU
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const payload = {
                fullName: data.fullName,
                phone: data.phone,
                status: data.status
            };
            
            await updateUserAPI(id, payload);
            toast.success("Cập nhật thông tin thành công!");
            navigate(`/admin/users/${id}`);
        } catch (error) {
            toast.error("Lỗi khi cập nhật thông tin!");
        } finally {
            setIsSaving(false);
        }
    };

    // 4. HIỂN THỊ SPINNER KHI ĐANG CHECK AUTH HOẶC ĐANG FETCH DATA
    if (authLoading) {
        return (
            <div className="max-w-3xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
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
                    <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700" aria-label="Quay lại">
                        <ArrowLeft size={18} />
                </button>
                    <div>
                        <p className="text-sm font-semibold text-sky-700">Cập nhật hồ sơ</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Chỉnh sửa người dùng</h2>
                    </div>
            </div>
            </section>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Họ và tên <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-sky-200 ${errors.fullName ? "border-rose-300" : "border-slate-300 focus:border-sky-400"}`}
                    />
                        </div>
                        {errors.fullName && <p className="mt-2 text-sm font-medium text-rose-600">{errors.fullName.message}</p>}
                </div>

                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="email"
                        {...register("email")}
                        readOnly
                                className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none"
                    />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">Email là thông tin định danh, không thể thay đổi.</p>
                </div>

                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        {...register("phone")}
                                className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
                    />
                        </div>
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

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition ${isSaving ? 'cursor-not-allowed bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'}`}
                    >
                        {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
