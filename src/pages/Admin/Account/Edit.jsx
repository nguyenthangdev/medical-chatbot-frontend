/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Mail, Save, ShieldAlert, ShieldUser, UserRound } from "lucide-react";
import { getAccountByIdAPI, updateAccountAPI } from "../../../apis/Admin/account.api";
import { getRolesAPI } from "../../../apis/Admin/role.api"; 
import { useAuth } from '../../../contexts/Admin/AdminAuthContext';

export default function AccountEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [roles, setRoles] = useState([]); // State lưu Role
    const [isFetchingDetail, setIsFetchingDetail] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { user, isLoading } = useAuth();

    const hasPermission = user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_edit');

    useEffect(() => {
        if (!isLoading && !hasPermission) {
            // toast.error("Bạn không có quyền chỉnh sửa Quản trị viên!");
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, hasPermission, navigate]);

    useEffect(() => {
        if (isLoading || !hasPermission) return;
        const fetchData = async () => {
            try {
                // Tải song song cả danh sách Role và chi tiết Account
                const [resAccount, resRoles] = await Promise.all([
                    getAccountByIdAPI(id),
                    getRolesAPI({ limit: 100 })
                ]);
                
                // setRoles(resRoles.data || []);
                
                // Đổ dữ liệu vào Form
                const acc = resAccount.account;
                if (acc.role_id?.isSystemAdmin) {
                    toast.error("Không thể chỉnh sửa tài khoản quản trị hệ thống!");
                    navigate('/admin/dashboard');
                    return;
                }
                const filteredRoles = (resRoles.data || []).filter(role => !role.isSystemAdmin);
                setRoles(filteredRoles);
                reset({
                    fullName: acc.fullName || "",
                    email: acc.email || "",
                    role_id: acc.role_id?._id || acc.role_id || "", // Gán ID của Role
                    status: acc.status || "active"
                });
            } catch (error) {
                toast.error("Lỗi khi tải dữ liệu!");
            } finally {
                setIsFetchingDetail(false);
            }
        };
        fetchData();
    }, [id, reset, navigate, isLoading, hasPermission]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const payload = {
                fullName: data.fullName,
                role_id: data.role_id, // Đẩy lên Backend bằng key role_id
                status: data.status
            };
            await updateAccountAPI(id, payload);
            toast.success("Cập nhật tài khoản thành công!");
            navigate(`/admin/accounts/${id}`);
        } catch (error) {
            toast.error("Lỗi khi cập nhật tài khoản!");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
        <div className="max-w-4xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
            <div className="space-y-4">
                <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
                <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
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
                        <p className="text-sm font-semibold text-sky-700">Cập nhật tài khoản quản trị</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Chỉnh sửa tài khoản</h2>
                    </div>
            </div>
            </section>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Họ và tên <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" {...register("fullName", { required: "Vui lòng nhập họ tên" })} className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-sky-200 ${errors.fullName ? "border-rose-300" : "border-slate-300 focus:border-sky-400"}`} />
                        </div>
                        {errors.fullName && <p className="mt-2 text-sm font-medium text-rose-600">{errors.fullName.message}</p>}
                </div>

                <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="email" {...register("email")} readOnly className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none" />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">Email là thông tin định danh, không thể thay đổi.</p>
                </div>

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
                        <select {...register("status")} className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200">
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Đã khóa</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                    <button type="submit" disabled={isSaving} className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold text-white shadow-sm transition ${isSaving ? "cursor-not-allowed bg-sky-400" : "bg-sky-600 hover:bg-sky-700"}`}>
                        {isSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
