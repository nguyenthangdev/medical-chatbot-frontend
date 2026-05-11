/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, AlertTriangle, X } from "lucide-react";
import DataTable from "../../../components/Admin/DataTable";
import { useAdminChat } from "../../../hooks/Admin/useAdminChat";
import { toast } from "react-toastify";

export default function ConversationIndex() {
    const {
        conversations,
        loading,
        error,
        fetchConversations,
        deleteConversationItem
    } = useAdminChat();

    // 1. Quản lý trạng thái qua Query Params
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const searchQuery = searchParams.get("search") || "";
    
    // Trạng thái cho Custom Popup Xóa
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // 2. Xử lý Tìm kiếm và Phân trang (Client-side)
    const { paginatedData, totalPages } = useMemo(() => {
        // Lọc theo keyword (tìm trong title hoặc userId)
        const filtered = conversations.filter((c) => {
            const keyword = searchQuery.toLowerCase();
            const titleMatch = c.title?.toLowerCase().includes(keyword);
            const userMatch = typeof c.userId === 'string' && c.userId.toLowerCase().includes(keyword);
            return titleMatch || userMatch;
        });

        // Tính toán phân trang
        const total = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
        
        // Đảm bảo page hiện tại không vượt quá tổng số trang
        const validPage = Math.min(Math.max(currentPage, 1), total);
        
        const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return { paginatedData: paginated, totalPages: total };
    }, [conversations, searchQuery, currentPage]);

    // Xử lý thay đổi URL khi nhập search
    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (value) {
            setSearchParams({ search: value, page: "1" });
        } else {
            setSearchParams({ page: "1" });
        }
    };

    // Xử lý thay đổi trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", newPage.toString());
            setSearchParams(newParams);
        }
    };

    const columns = [
        { header: "ID", accessor: "_id" },
        { header: "User", accessor: "userId" },
        { header: "Title", accessor: "title" },
        { header: "Model", accessor: "model" },
        { 
            header: "Last Updated", 
            accessor: "updatedAt",
            render: (item) => new Date(item.updatedAt).toLocaleString("vi-VN")
        },
    ];

    // Mở popup xác nhận
    const confirmDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    // Thực hiện xóa sau khi xác nhận trên popup
    const executeDelete = async () => {
        try {
            await deleteConversationItem(deleteModal.id);
            toast.success("Đã xóa cuộc hội thoại!");
        } catch (err) {
            toast.error("Xóa thất bại!");
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertTriangle size={20} />
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-80px)]">
            {/* Header & Thanh công cụ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    Conversation Management
                </h1>

                {/* Thanh Search */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề, user..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchParams({ page: "1" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {loading && conversations.length === 0 ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* Bảng dữ liệu */}
                    <DataTable
                        columns={columns}
                        data={paginatedData} // Truyền dữ liệu đã cắt trang
                        basePath="/admin/conversations"
                        onDelete={confirmDelete} // Trỏ vào hàm mở popup
                        actions={["view", "delete"]}
                    />

                    {/* Điều khiển phân trang */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 border-t pt-4">
                            <p className="text-sm text-gray-500">
                                Trang <span className="font-medium text-gray-900">{currentPage}</span> / {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* CUSTOM POPUP CONFIRM DELETE */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa cuộc hội thoại?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Hành động này không thể hoàn tác. Tất cả tin nhắn trong cuộc hội thoại này sẽ bị xóa vĩnh viễn.
                            </p>
                            
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, id: null })}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition shadow-sm shadow-red-200"
                                >
                                    Xóa ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}