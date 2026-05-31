/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertTriangle, KeyRound, Plus, Search, Shield, ShieldAlert, Trash2 } from "lucide-react";
import DataTable from "../../../components/Admin/DataTable";
import Pagination from "../../../components/Admin/Pagination";
import { getRolesAPI, deleteRoleAPI } from "../../../apis/Admin/role.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext";

export default function RoleIndex() {
    const navigate = useNavigate();
    const { user: adminUser, isLoading: authLoading } = useAuth();

    const [roles, setRoles] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const keyword = searchParams.get("keyword") || "";

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_view');
    const canCreate = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_create');
    const canConfigPermissions = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_permissions');

    useEffect(() => {
        if (!authLoading && !hasPermission) {
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [authLoading, hasPermission, navigate]);

    const columns = [
        { header: "Tên nhóm quyền", accessor: "title", render: (row) => <strong className={row.isSystemAdmin ? "text-sky-700" : "text-slate-900"}>{row.title}</strong> },
        { header: "Mã định danh", accessor: "titleId", render: (row) => <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-600">{row.titleId}</span> },
        { header: "Mô tả", accessor: "description", render: (row) => <span className="block max-w-xs truncate text-slate-500">{row.description || 'Chưa có mô tả'}</span> },
        { header: "Trạng thái", accessor: "status" },
        { header: "Ngày tạo", accessor: "createdAt", render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN") },
    ];

    const fetchRoles = useCallback(async () => {
        if (authLoading || !hasPermission) return;
        try {
            const res = await getRolesAPI({ page, limit, keyword });
            setRoles(res.data);
            setPagination(res.pagination);
            if (res.keyword) setSearchInput(res.keyword);
        } catch (error) {
            console.log("Lỗi tải danh sách nhóm quyền!");
        }
    }, [page, limit, keyword, authLoading, hasPermission]);
                console.log(pagination)

    useEffect(() => { fetchRoles(); }, [fetchRoles]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ keyword: searchInput, page: 1 });
    };

    const updateParams = (newParams) => {
        setSearchParams({ ...Object.fromEntries([...searchParams]), ...newParams });
    };

    const openDeleteModal = (id) => setDeleteModal({ isOpen: true, id });
    const closeDeleteModal = () => setDeleteModal({ isOpen: false, id: null });

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteRoleAPI(deleteModal.id);
            toast.success("Xóa nhóm quyền thành công!");
            
            // Xử lý giật lùi trang nếu xóa phần tử cuối cùng của trang hiện tại
            if (roles.length === 1 && page > 1) {
                setSearchParams({ ...Object.fromEntries([...searchParams]), page: page - 1 });
            } else {
                fetchRoles();
            }
            closeDeleteModal();
        } catch (err) {
            toast.error("Xóa thất bại!");
            closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-6 w-52 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        );
    }

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

    return (
        <div className="relative space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                            <Shield size={16} />
                            Quản lý nhóm quyền
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Nhóm quyền</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Quản lý vai trò vận hành và phạm vi truy cập của từng nhóm quản trị viên.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    {canConfigPermissions && (
                            <Link to="/admin/permissions" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">
                                <KeyRound size={17} />
                                Phân quyền
                        </Link>
                    )}
                    {canCreate && (
                            <Link to="/admin/roles/create" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">
                                <Plus size={18} />
                                Thêm mới
                        </Link>
                    )}
                </div>
            </div>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-5 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Nhập tên nhóm quyền..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200" />
                    </div>
                    <button type="submit" className="h-12 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">Tìm kiếm</button>
                </form>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
                <DataTable 
                  columns={columns} 
                  data={roles} 
                  basePath="/admin/roles" 
                  onDelete={openDeleteModal} // TRUYỀN HÀM MỞ MODAL VÀO ĐÂY
                  actions={[
                      (adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_view')) && 'view',
                      (adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_edit')) && 'edit',
                      (adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('roles_delete')) && 'delete'
                  ].filter(Boolean)} 
                  hideActionsIf={(row) => row.isSystemAdmin}
                />
                <Pagination
                    pagination={pagination}
                    items={roles}
                    handlePagination={(p) => updateParams({ page: p })}
                    handlePaginationPrevious={(p) => updateParams({ page: p - 1 })}
                    handlePaginationNext={(p) => updateParams({ page: p + 1 })}
                />
            </section>

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity" onClick={closeDeleteModal}></div>
                    
                    <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                                <AlertTriangle size={30} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-slate-950">Xác nhận xóa nhóm quyền</h3>
                            <p className="mb-6 text-sm leading-6 text-slate-500 md:text-base">
                                Bạn có chắc chắn muốn xóa nhóm quyền này không? Hành động này <span className="font-semibold text-slate-700">không thể hoàn tác</span>.
                            </p>
                            <div className="flex w-full flex-col gap-3 sm:flex-row">
                                <button 
                                    onClick={closeDeleteModal} 
                                    disabled={isDeleting} 
                                    className="flex-1 rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 md:text-base"
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    onClick={handleConfirmDelete} 
                                    disabled={isDeleting} 
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50 md:text-base"
                                >
                                    {isDeleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white"></div> : <Trash2 size={16} />}
                                    {isDeleting ? 'Đang xóa...' : 'Xóa luôn'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
