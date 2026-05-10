/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAccountsAPI, deleteAccountAPI } from '../../../apis/Admin/account.api';

export default function AccountIndex() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // STATE QUẢN LÝ POPUP XÓA
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, accountId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await getAccountsAPI();
      setAccounts(res.accounts || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  // CÁC HÀM XỬ LÝ POPUP
  const openDeleteModal = (id) => setDeleteModal({ isOpen: true, accountId: id });
  const closeDeleteModal = () => setDeleteModal({ isOpen: false, accountId: null });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountAPI(deleteModal.accountId);
      toast.success("Xóa tài khoản thành công!");
      fetchAccounts(); 
      closeDeleteModal(); 
    } catch (error) {
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div className="p-4 md:p-6">Đang tải dữ liệu...</div>;

  return (
    // Responsive: p-4 trên mobile, p-6 trên màn hình lớn
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 relative">
      
      {/* Responsive Header: flex-col trên mobile, flex-row trên màn hình lớn */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý Quản trị viên</h2>
        <Link 
          to="/admin/accounts/create" 
          // Responsive Button: w-full trên mobile, auto trên màn hình lớn
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Thêm tài khoản
        </Link>
      </div>

      {/* Responsive Table: Tràn viền (-mx-4) trên mobile cho dễ vuốt ngang */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-left border-collapse">
            <thead>
              {/* Thêm whitespace-nowrap để chữ không bị rớt dòng làm xấu bảng */}
              <tr className="bg-gray-50 border-y md:border-t-0 border-gray-200 text-gray-500 uppercase text-xs whitespace-nowrap">
                <th className="p-4 font-semibold">Họ và tên</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Vai trò</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                // Thêm whitespace-nowrap
                <tr key={acc._id} className="border-b border-gray-100 hover:bg-gray-50 transition whitespace-nowrap">
                  <td className="p-4 font-medium text-gray-800">{acc.fullName}</td>
                  <td className="p-4 text-gray-600">{acc.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${acc.role === 'Super Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                      {acc.role || 'Admin'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${acc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {acc.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link to={`/admin/accounts/${acc._id}`} className="text-blue-500 hover:text-blue-700 hover:underline mr-4 font-medium">Xem</Link>
                    <Link to={`/admin/accounts/${acc._id}/edit`} className="text-blue-500 hover:text-blue-700 hover:underline mr-4 font-medium">Sửa</Link>
                    <button 
                      onClick={() => openDeleteModal(acc._id)} 
                      className="text-red-500 hover:text-red-700 hover:underline font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Chưa có tài khoản nào trong hệ thống.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL XÁC NHẬN XÓA */}
      {deleteModal.isOpen && (
        // p-4 ở đây giúp modal không chạm sát viền trên màn hình điện thoại
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={closeDeleteModal}
          ></div>

          {/* w-full max-w-sm: Chiếm full màn hình điện thoại, nhưng lên máy tính thì tối đa 384px */}
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
              
              {/* flex-row đảm bảo 2 nút luôn nằm ngang, dù trên điện thoại nhỏ */}
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