/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Mail, Pencil, ShieldAlert, ShieldCheck, ShieldUser, UserRound } from "lucide-react";
import { getAccountByIdAPI } from "../../../apis/Admin/account.api";
import { useAuth } from '../../../contexts/Admin/AdminAuthContext'; 

export default function AccountDetail() {
    const { id } = useParams();
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const hasPermission = user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_view');
    const canEdit = user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_edit');
    
    const [isFetchingDetail, setIsFetchingDetail] = useState(true);

    useEffect(() => {
        if (!isLoading && !hasPermission) {
            // toast.error("Bạn không có quyền xem chi tiết tài khoản này!");
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, hasPermission, navigate]);

    useEffect(() => {
        if (isLoading || !hasPermission) return;
        const fetchDetail = async () => {
            try {
                const res = await getAccountByIdAPI(id);
                setAccount(res.account);
            } catch (error) {
                // toast.error("Không thể tải thông tin tài khoản!");
                console.log("Không thể tải thông tin tài khoản!")
                // navigate('/admin/dashboard'); 
            } finally {
                setIsFetchingDetail(false);
            }
        };
        fetchDetail();
    }, [hasPermission, id, isLoading, navigate]);

    // if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>;
    // if (!account) return null;
    if (isLoading) {
        return (
        <div className="max-w-4xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
            <div className="space-y-4">
                <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
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

    if (!account) return null;

    return (
        <div className="max-w-5xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/admin/accounts')} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700" aria-label="Quay lại danh sách tài khoản">
                            <ArrowLeft size={18} />
                    </button>
                        <div>
                            <p className="text-sm font-semibold text-sky-700">Chi tiết tài khoản quản trị</p>
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Hồ sơ quản trị viên</h2>
                        </div>
                </div>
                
                {canEdit && !account.role_id?.isSystemAdmin && (
                  <Link to={`/admin/accounts/${account._id}/edit`} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">
                    <Pencil size={16} />
                    Chỉnh sửa
                  </Link>
                )}
            </div>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-3xl text-3xl font-semibold ${account.role_id?.isSystemAdmin ? "bg-rose-50 text-rose-700" : "bg-sky-100 text-sky-700"}`}>
                        {account.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate text-2xl font-semibold text-slate-950">{account.fullName}</h3>
                        <p className="mt-1 text-sm text-slate-500">{account.email}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${account.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'}`}>
                                {account.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                            {account.role_id?.isSystemAdmin && (
                                <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                                    Tài khoản hệ thống
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard icon={UserRound} label="Họ và tên" value={account.fullName || "Chưa cập nhật"} />
                    <InfoCard icon={Mail} label="Email" value={account.email || "Chưa cập nhật"} />
                    <InfoCard icon={account.role_id?.isSystemAdmin ? ShieldCheck : ShieldUser} label="Nhóm quyền" value={account.role_id?.title || 'Chưa phân quyền'} />
                    <InfoCard icon={CalendarDays} label="Ngày tạo" value={new Date(account.createdAt).toLocaleString('vi-VN')} />
                    <InfoCard icon={CalendarDays} label="Cập nhật lần cuối" value={new Date(account.updatedAt).toLocaleString('vi-VN')} />
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
