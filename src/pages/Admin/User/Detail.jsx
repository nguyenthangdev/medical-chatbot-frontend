/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CalendarDays, Mail, Pencil, Phone, ShieldAlert, UserRound } from "lucide-react";
import { getUserByIdAPI } from "../../../apis/Admin/user.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext"; 

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [clientUser, setClientUser] = useState(null); 
    const [isFetchingDetail, setIsFetchingDetail] = useState(true);

    const { user: adminUser, isLoading: authLoading } = useAuth(); 

    const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('users_view');
    const canEdit = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('users_edit');

    useEffect(() => {
        if (!authLoading && !hasPermission) {
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [authLoading, hasPermission, navigate]);

    useEffect(() => {
        if (authLoading || !hasPermission) return;
        const fetchDetail = async () => {
            try {
                const res = await getUserByIdAPI(id);
                setClientUser(res.data);
            } catch (error) {
                toast.error("Không tìm thấy người dùng!");
                navigate("/admin/dashboard");
            } finally {
                setIsFetchingDetail(false);
            }
        };
        fetchDetail();
    }, [id, authLoading, hasPermission, navigate]);

    if (authLoading) {
        return (
            <div className="max-w-4xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-8 w-52 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
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

    if (!clientUser) return null;

    return (
        <div className="max-w-5xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/users")}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                            aria-label="Quay lại danh sách người dùng"
                    >
                            <ArrowLeft size={18} />
                    </button>
                        <div>
                            <p className="text-sm font-semibold text-sky-700">Chi tiết người dùng</p>
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Hồ sơ người dùng</h2>
                        </div>
                </div>
                {canEdit && (
                        <Link to={`/admin/users/${id}/edit`} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">
                            <Pencil size={16} />
                            Chỉnh sửa
                        </Link>
                )}
            </div>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-100 text-3xl font-semibold text-sky-700">
                        {(clientUser.fullName || clientUser.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate text-2xl font-semibold text-slate-950">{clientUser.fullName || "Chưa cập nhật"}</h3>
                        <p className="mt-1 text-sm text-slate-500">{clientUser.email || "Chưa cập nhật email"}</p>
                        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${clientUser.status === "active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"}`}>
                            {clientUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard icon={UserRound} label="Họ và tên" value={clientUser.fullName || "Chưa cập nhật"} />
                    <InfoCard icon={Mail} label="Email" value={clientUser.email || "Chưa cập nhật"} />
                    <InfoCard icon={Phone} label="Số điện thoại" value={clientUser.phone || "Chưa cập nhật"} />
                    <InfoCard icon={CalendarDays} label="Ngày đăng ký" value={new Date(clientUser.createdAt).toLocaleString('vi-VN')} />
                </div>
            </section>
        </div>
    );
}

function InfoCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-slate-300 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                    <Icon size={18} />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 break-words text-base font-semibold text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
