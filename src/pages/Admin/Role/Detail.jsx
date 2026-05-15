/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CalendarDays, FileText, Hash, Pencil, Shield, ShieldAlert } from "lucide-react";
import { getRoleDetailAPI } from "../../../apis/Admin/role.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext"; // DÙNG useAuth CHUẨN

export default function RoleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [roleDetail, setRoleDetail] = useState(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState(true); // Đổi tên để không trùng Context
    
    const { user: adminUser, isLoading: authLoading } = useAuth(); // LẤY AUTH

    // KIỂM TRA QUYỀN
    const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_view');
    const canEdit = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_edit');

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
                const res = await getRoleDetailAPI(id);
                setRoleDetail(res);
            } catch (error) {
                // toast.error("Không tìm thấy thông tin nhóm quyền!");
                console.log("Không tìm thấy thông tin nhóm quyền!")
                // navigate("/admin/roles");
            } finally {
                setIsFetchingDetail(false);
            }
        };
        fetchDetail();
    }, [id, authLoading, hasPermission, navigate]);

    // GỘP LOADING (AUTH VÀ LẤY CHI TIẾT)
    if (authLoading) {
        return (
            <div className="max-w-5xl rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        );
    }

    // CHẶN GIAO DIỆN NẾU KHÔNG CÓ QUYỀN
    if (!hasPermission) {
        return (
            <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <ShieldAlert size={26} />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">Bạn không có quyền truy cập trang này</p>
                <p className="mt-2 text-sm text-slate-500">Hệ thống đang chuyển hướng về trang tổng quan.</p>
            </div>
        );
    }

    if (!roleDetail) return null;

    return (
        <div className="max-w-5xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/admin/roles')}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                            aria-label="Quay lại danh sách nhóm quyền"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <p className="text-sm font-semibold text-sky-700">Chi tiết nhóm quyền</p>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{roleDetail.title}</h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {canEdit && !roleDetail.isSystemAdmin && (
                            <Link
                                to={`/admin/roles/${id}/edit`}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                            >
                                <Pencil size={16} />
                                Chỉnh sửa
                            </Link>
                        )}
                        <Link
                            to="/admin/roles"
                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                            Đóng
                        </Link>
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard icon={Shield} label="Tên nhóm quyền" value={roleDetail.title} />
                    <InfoCard icon={Hash} label="Mã định danh" value={roleDetail.titleId} mono />
                    <InfoCard icon={CalendarDays} label="Ngày tạo" value={new Date(roleDetail.createdAt).toLocaleString("vi-VN")} />
                </div>

                {roleDetail.isSystemAdmin && (
                    <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-medium text-sky-700">
                        Đây là nhóm quyền hệ thống, các thao tác chỉnh sửa bị giới hạn để bảo vệ cấu hình lõi.
                    </div>
                )}

                <div className="mt-6 rounded-3xl border border-slate-300 bg-slate-50/70 p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <FileText size={18} className="text-sky-700" />
                        <h2 className="text-base font-semibold text-slate-950">Mô tả nhóm quyền</h2>
                    </div>
                    <div
                        className="markdown-content text-sm leading-7 text-slate-600"
                        dangerouslySetInnerHTML={{ __html: roleDetail.description || '<i class="text-slate-400">Không có mô tả</i>' }}
                    />
                </div>
            </section>
        </div>
    );
}

function InfoCard({ icon: Icon, label, value, mono = false }) {
    return (
        <div className="rounded-2xl border border-slate-300 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                    <Icon size={18} />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className={`mt-1 break-words text-base font-semibold text-slate-900 ${mono ? "font-mono" : ""}`}>{value}</p>
                </div>
            </div>
        </div>
    );
}
