/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom"; 
import { toast } from "react-toastify";
import DataTable from "../../../components/Admin/DataTable";
import Pagination from "../../../components/Admin/Pagination"; // Component phân trang vừa tạo
import { getUsersAPI, deleteUserAPI } from "../../../apis/Admin/user.api";

export default function UserIndex() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Đọc parameters hiện tại từ URL
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const keyword = searchParams.get("keyword") || "";

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const columns = [
        { header: "Họ và tên", accessor: "fullName" },
        { header: "Email", accessor: "email" },
        { header: "Điện thoại", accessor: "phone" },
        { header: "Trạng thái", accessor: "status" },
    ];

    const fetchUsers = useCallback(async () => {
        try {
            const params = { page, limit, keyword };
            const res = await getUsersAPI(params);
            
            setUsers(res.users);
            setPagination(res.pagination);
            // Cập nhật lại thanh search nếu người dùng F5 bằng link có sẵn keyword
            if(res.keyword) setSearchInput(res.keyword);
        } catch (error) {
            toast.error("Lỗi tải danh sách người dùng!");
        }
    }, [page, limit, keyword]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Thay đổi parameter trên URL để kích hoạt effect
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

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý Người dùng
                </h1>
            </div>

            {/* Khối Search ngoài DataTable */}
            <div className="bg-white shadow rounded-lg p-6 text-gray-800 mb-4">
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

            <div className="bg-white shadow rounded-lg p-6">
                <DataTable
                    columns={columns}
                    data={users}
                    basePath="/admin/users"
                    onDelete={openDeleteModal} 
                />

                <Pagination
                    pagination={pagination}
                    items={users}
                    handlePagination={(pageIndex) => updateParams({ page: pageIndex })}
                    handlePaginationPrevious={(pageIndex) => updateParams({ page: pageIndex - 1 })}
                    handlePaginationNext={(pageIndex) => updateParams({ page: pageIndex + 1 })}
                />
            </div>

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
                                Bạn có chắc chắn muốn xóa người dùng này không? Hành động này <span className="font-semibold text-gray-700">không thể hoàn tác</span>.
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