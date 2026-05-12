/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DataTable from '../../../components/Admin/DataTable';
import Pagination from '../../../components/Admin/Pagination';
import { getAccountsAPI, deleteAccountAPI } from '../../../apis/Admin/account.api';

export default function AccountIndex() {
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Đọc parameters từ URL
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const keyword = searchParams.get("keyword") || "";

  // STATE QUẢN LÝ POPUP XÓA
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, accountId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Cột cho DataTable
  const columns = [
    { header: "Họ và tên", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Vai trò", accessor: "role" },
    { header: "Trạng thái", accessor: "status" },
  ];

  const fetchAccounts = useCallback(async () => {
    try {
      const params = { page, limit, keyword };
      const res = await getAccountsAPI(params);
      
      setAccounts(res.accounts || []);
      setPagination(res.pagination);
      if (res.keyword) setSearchInput(res.keyword);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tài khoản');
    }
  }, [page, limit, keyword]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Hàm update URL Params
  const updateParams = (newParams) => {
    const currentParams = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentParams, ...newParams });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ keyword: searchInput, page: 1 });
  };

  // CÁC HÀM XỬ LÝ POPUP
  const openDeleteModal = (id) => setDeleteModal({ isOpen: true, accountId: id });
  const closeDeleteModal = () => setDeleteModal({ isOpen: false, accountId: null });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountAPI(deleteModal.accountId);
      toast.success("Xóa tài khoản thành công!");
      
      // Nếu xóa item cuối cùng của trang, lùi lại 1 trang
      if (accounts.length === 1 && page > 1) {
        updateParams({ page: page - 1 });
      } else {
        fetchAccounts(); 
      }
      closeDeleteModal(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa thất bại!");
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý Quản trị viên</h2>
        <Link 
          to="/admin/accounts/create" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Thêm tài khoản
        </Link>
      </div>

      {/* Khối Search (Chuyển ra ngoài DataTable cho đồng bộ) */}
      <div className="bg-white shadow rounded-lg p-6 text-gray-800 mb-4 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full md:w-80"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* Khối Bảng dữ liệu & Phân trang */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <DataTable
            columns={columns}
            data={accounts}
            basePath="/admin/accounts"
            onDelete={openDeleteModal} 
        />

        <Pagination
            pagination={pagination}
            items={accounts}
            handlePagination={(pageIndex) => updateParams({ page: pageIndex })}
            handlePaginationPrevious={(pageIndex) => updateParams({ page: pageIndex - 1 })}
            handlePaginationNext={(pageIndex) => updateParams({ page: pageIndex + 1 })}
        />
      </div>

      {/* MODAL XÁC NHẬN XÓA (Giữ nguyên cấu trúc UI cũ) */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={closeDeleteModal}
          ></div>

          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 transform transition-all animate-fade-in-up">
            <div className="flex flex-col items-center text-center">
              
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-500 mb-6 leading-relaxed text-sm md:text-base">
                Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này <span className="font-semibold text-gray-700">không thể hoàn tác</span>.
              </p>
              
              <div className="flex flex-row w-full gap-3">
                <button 
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm md:text-base"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2 text-sm md:text-base"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      Đang xóa...
                    </>
                  ) : 'Xóa luôn'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}