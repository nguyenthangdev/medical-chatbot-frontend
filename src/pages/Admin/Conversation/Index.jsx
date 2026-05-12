/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../../components/Admin/DataTable";
import Pagination from "../../../components/Admin/Pagination";
import { getConversationsAPI, deleteConversationAPI } from "../../../apis/Admin/conversation.api";

export default function ConversationIndex() {
    const [conversations, setConversations] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    
    const [searchParams, setSearchParams] = useSearchParams();
    
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const keyword = searchParams.get("keyword") || "";

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const columns = [
        { header: "Mã hội thoại", accessor: "_id" },
        { header: "Người dùng", accessor: "userName" }, // Đã map ở hàm fetch
        { header: "Tiêu đề", accessor: "title" },
        { header: "Mô hình", accessor: "model" },
        { header: "Cập nhật lần cuối", accessor: "updatedDate" }, // Đã map ở hàm fetch
    ];

    const fetchConversations = useCallback(async () => {
        try {
            const params = { page, limit, keyword };
            const res = await getConversationsAPI(params);
            
            // Định dạng lại dữ liệu trước khi đẩy vào DataTable cho đẹp
            const formattedData = res.data.map(conv => ({
                ...conv,
                userName: conv.userId?.fullName || conv.userId?.email || 'N/A',
                updatedDate: new Date(conv.updatedAt).toLocaleString("vi-VN")
            }));

            setConversations(formattedData);
            setPagination(res.pagination);
            if(res.keyword) setSearchInput(res.keyword);
        } catch (error) {
            toast.error("Lỗi tải danh sách cuộc hội thoại!");
        }
    }, [page, limit, keyword]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const updateParams = (newParams) => {
        const currentParams = Object.fromEntries([...searchParams]);
        setSearchParams({ ...currentParams, ...newParams });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateParams({ keyword: searchInput, page: 1 });
    };

    const confirmDelete = (id) => setDeleteModal({ isOpen: true, id });
    const closeDeleteModal = () => setDeleteModal({ isOpen: false, id: null });

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteConversationAPI(deleteModal.id);
            toast.success("Đã xóa cuộc hội thoại!");
            if (conversations.length === 1 && page > 1) {
                updateParams({ page: page - 1 });
            } else {
                fetchConversations();
            }
            closeDeleteModal();
        } catch (err) {
            toast.error("Xóa thất bại!");
            closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý Cuộc hội thoại
                </h1>
            </div>

            {/* Form Tìm kiếm */}
            <div className="bg-white shadow rounded-lg p-6 text-gray-800 mb-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm theo tên người dùng, tiêu đề, mã ID..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full md:w-[400px]"
                    />
                    <button 
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                    >
                        Tìm kiếm
                    </button>
                </form>
            </div>

            {/* Bảng Dữ liệu */}
            <div className="bg-white shadow rounded-lg p-6">
                <DataTable
                    columns={columns}
                    data={conversations} 
                    basePath="/admin/conversations"
                    onDelete={confirmDelete}
                    actions={["view", "delete"]}
                />

                <Pagination
                    pagination={pagination}
                    items={conversations}
                    handlePagination={(pageIndex) => updateParams({ page: pageIndex })}
                    handlePaginationPrevious={(pageIndex) => updateParams({ page: pageIndex - 1 })}
                    handlePaginationNext={(pageIndex) => updateParams({ page: pageIndex + 1 })}
                />
            </div>

            {/* Modal Xóa */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <span className="text-red-600 text-2xl">⚠</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Cuộc hội thoại này sẽ được đưa vào thùng rác.
                            </p>
                            
                            <div className="flex gap-3 w-full">
                                <button
                                    disabled={isDeleting}
                                    onClick={closeDeleteModal}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    disabled={isDeleting}
                                    onClick={executeDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition flex justify-center items-center gap-2"
                                >
                                    {isDeleting ? 'Đang xóa...' : 'Xóa ngay'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}