/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import { AlertTriangle, Search, ShieldAlert, Trash2, Users } from "lucide-react";
import DataTable from "../../../components/Admin/DataTable";
import Pagination from "../../../components/Admin/Pagination"; 
import { getUsersAPI, deleteUserAPI } from "../../../apis/Admin/user.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext"; // THÊM IMPORT

export default function UserIndex() {
    const navigate = useNavigate();
    const { user: adminUser, isLoading: authLoading } = useAuth(); // LẤY AUTH VÀ ĐỔI TÊN BIẾN
    
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const keyword = searchParams.get("keyword") || "";

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. KIỂM TRA QUYỀN (users_view)
    const hasPermission = adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('users_view');

    useEffect(() => {
        if (!authLoading && !hasPermission) {
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [authLoading, hasPermission, navigate]);

    const columns = [
        { header: "Họ và tên", accessor: "fullName" },
        { header: "Email", accessor: "email" },
        { header: "Điện thoại", accessor: "phone" },
        { header: "Trạng thái", accessor: "status" },
    ];

    // 2. FETCH DATA (CHẶN NẾU KHÔNG CÓ QUYỀN)
    const fetchUsers = useCallback(async () => {
        if (authLoading || !hasPermission) return;
        try {
            const params = { page, limit, keyword };
            const res = await getUsersAPI(params);
            
            setUsers(res.users || []);
            setPagination(res.pagination);
            if(res.keyword) setSearchInput(res.keyword);
        } catch (error) {
            toast.error("Lỗi tải danh sách người dùng!");
        }
    }, [page, limit, keyword, authLoading, hasPermission]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const updateParams = (newParams) => {
        const currentParams = Object.fromEntries([...searchParams]);
        setSearchParams({ ...currentParams, ...newParams });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateParams({ keyword: searchInput, page: 1 });
    };

    const openDeleteModal = (id) => setDeleteModal({ isOpen: true, userId: id });
    const closeDeleteModal = () => setDeleteModal({ isOpen: false, userId: null });

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUserAPI(deleteModal.userId);
            toast.success("Xóa người dùng thành công!");
            fetchUsers(); 
            closeDeleteModal(); 
        } catch (error) {
            toast.error("Lỗi khi xóa người dùng!");
            closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    // 3. HIỂN THỊ SPINNER TOÀN CỤC KHI ĐANG CHECK AUTH
    if (authLoading) {
        return (
            <div className="rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-6 w-48 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        );
    }

    // 4. CHẶN GIAO DIỆN NẾU KHÔNG CÓ QUYỀN
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
                            <Users size={16} />
                            Quản lý tài khoản người dùng
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                            Tài khoản người dùng
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Theo dõi thông tin, trạng thái và quyền thao tác với người dùng đang sử dụng Medical Chatbot.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-500">Tổng bản ghi</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-950">{pagination?.totalItems ?? users.length}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-5 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
                        />
                    </div>
                    <button type="submit" className="h-12 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">
                            Tìm kiếm
                        </button>
                </form>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
                <DataTable
                    columns={columns}
                    data={users}
                    basePath="/admin/users"
                    onDelete={openDeleteModal}
                    // TRUYỀN PHÂN QUYỀN VÀO NÚT HÀNH ĐỘNG DATATABLE
                    actions={[
                        (adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('users_view')) && 'view',
                        (adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('users_edit')) && 'edit',
                        (adminUser?.role_id?.isSystemAdmin || adminUser?.role_id?.permissions?.includes('users_delete')) && 'delete'
                    ].filter(Boolean)}
                />

                <Pagination
                    pagination={pagination}
                    items={users}
                    handlePagination={(pageIndex) => updateParams({ page: pageIndex })}
                    handlePaginationPrevious={(pageIndex) => updateParams({ page: pageIndex - 1 })}
                    handlePaginationNext={(pageIndex) => updateParams({ page: pageIndex + 1 })}
                />
            </section>

            {/* Khối modal Delete giữ nguyên */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity" onClick={closeDeleteModal}></div>
                    <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                                <AlertTriangle size={30} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-slate-950">Xác nhận xóa người dùng</h3>
                            <p className="mb-6 text-sm leading-6 text-slate-500 md:text-base">
                                Bạn có chắc chắn muốn xóa người dùng này không? Hành động này <span className="font-semibold text-slate-700">không thể hoàn tác</span>.
                            </p>
                            <div className="flex w-full flex-col gap-3 sm:flex-row">
                                <button onClick={closeDeleteModal} disabled={isDeleting} className="flex-1 rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 md:text-base">Hủy bỏ</button>
                                <button onClick={handleConfirmDelete} disabled={isDeleting} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50 md:text-base">
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
