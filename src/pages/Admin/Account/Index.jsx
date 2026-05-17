/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertTriangle, Plus, Search, ShieldAlert, ShieldUser, Trash2 } from 'lucide-react';
import DataTable from '../../../components/Admin/DataTable';
import Pagination from '../../../components/Admin/Pagination';
import { getAccountsAPI, deleteAccountAPI } from '../../../apis/Admin/account.api';
import { useAuth } from '../../../contexts/Admin/AdminAuthContext';

export default function AccountIndex() {
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const { user, isLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Đọc parameters từ URL
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const keyword = searchParams.get("keyword") || "";

  // STATE QUẢN LÝ POPUP XÓA
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, accountId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const hasPermission = user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_view');

  useEffect(() => {
    if (!isLoading && !hasPermission) {
      const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasPermission, navigate]);

  // Cột cho DataTable
  const columns = [
    { header: "Họ và tên", accessor: "fullName", render: (row) => <strong className={row.role_id?.isSystemAdmin ? "text-rose-700" : "text-slate-900"}>{row.fullName}</strong> },
    { header: "Email", accessor: "email" },
    { 
      header: "Vai trò", 
      accessor: "role_id",
      render: (row) => (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.role_id?.isSystemAdmin ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'}`}>
            {row.role_id?.title || 'Chưa phân quyền'}
        </span>
      )
    },
    { header: "Trạng thái", accessor: "status" },
  ];

  const sortSystemAdminFirst = (accountList = []) => {
    return [...accountList].sort((a, b) => {
      const aIsAdmin = a.role_id?.isSystemAdmin ? 1 : 0;
      const bIsAdmin = b.role_id?.isSystemAdmin ? 1 : 0;
      return bIsAdmin - aIsAdmin;
    });
  };

  const reloadAccounts = async () => {
    if (isLoading || !hasPermission) return; 
    try {
      const params = { page, limit, keyword };
      const res = await getAccountsAPI(params);
      setAccounts(sortSystemAdminFirst(res.accounts));
      setPagination(res.pagination);
      if (res.keyword) setSearchInput(res.keyword);
    } catch (error) {
      console.log("Lỗi khi tải danh sách tài khoản");
    } 
  };

  useEffect(() => {
    if (isLoading || !hasPermission) return undefined;

    let cancelled = false;
    const params = { page, limit, keyword };

    getAccountsAPI(params)
      .then((res) => {
        if (cancelled) return;
        setAccounts(sortSystemAdminFirst(res.accounts));
        setPagination(res.pagination);
        if (res.keyword) setSearchInput(res.keyword);
      })
      .catch(() => {
        if (!cancelled) console.log("Lỗi khi tải danh sách tài khoản");
      });

    return () => {
      cancelled = true;
    };
  }, [page, limit, keyword, isLoading, hasPermission]);

  const updateParams = (newParams) => {
    const currentParams = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentParams, ...newParams });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ keyword: searchInput, page: 1 });
  };

  const openDeleteModal = (id) => setDeleteModal({ isOpen: true, accountId: id });
  const closeDeleteModal = () => setDeleteModal({ isOpen: false, accountId: null });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountAPI(deleteModal.accountId);
      toast.success("Xóa tài khoản thành công!");
      if (accounts.length === 1 && page > 1) {
        updateParams({ page: page - 1 });
      } else {
        reloadAccounts(); 
      }
      closeDeleteModal(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa thất bại!");
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-300 bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-56 animate-pulse rounded-full bg-slate-100" />
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
              <ShieldUser size={16} />
              Quản lý tài khoản quản trị
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Tài khoản quản trị</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Quản lý nhân sự vận hành, vai trò và trạng thái truy cập vào hệ thống quản trị.
            </p>
          </div>
        
        {/* ĐÃ FIX LỖI BỊ LỒNG 2 THẺ LINK */}
        {(user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_create')) && (
          <Link 
            to="/admin/accounts/create" 
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 sm:w-auto"
          >
              <Plus size={18} /> Thêm tài khoản
          </Link>
        )}
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
            <button 
              type="submit"
              className="h-12 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Tìm kiếm
            </button>
          </form>
      </section>

      <section className="rounded-[28px] border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
        <DataTable
            columns={columns}
            data={accounts}
            basePath="/admin/accounts"
            onDelete={openDeleteModal} 
            hideEditIf={(row) => row.role_id?.isSystemAdmin}
            hideDeleteIf={(row) => row.role_id?.isSystemAdmin} 
            actions={[
              (user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_view')) && 'view',
              (user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_edit')) && 'edit',
              (user?.role_id?.isSystemAdmin || user?.role_id?.permissions?.includes('accounts_delete')) && 'delete'
            ].filter(Boolean)}
        />

        <Pagination
            pagination={pagination}
            items={accounts}
            handlePagination={(pageIndex) => updateParams({ page: pageIndex })}
            handlePaginationPrevious={(pageIndex) => updateParams({ page: pageIndex - 1 })}
            handlePaginationNext={(pageIndex) => updateParams({ page: pageIndex + 1 })}
        />
      </section>

      {/* Modal xác nhận xóa ... */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity" onClick={closeDeleteModal}></div>
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                <AlertTriangle size={30} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-950">Xác nhận xóa tài khoản</h3>
              <p className="mb-6 text-sm leading-6 text-slate-500 md:text-base">
                Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này <span className="font-semibold text-slate-700">không thể hoàn tác</span>.
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
