/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../../components/Admin/DataTable";
import Pagination from "../../../components/Admin/Pagination";
import { getAllMessagesAPI, deleteMessageAPI } from "../../../apis/Admin/message.api";
import { getConversationsAPI } from "../../../apis/Admin/conversation.api";

export default function MessageIndex() {
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]); // Để đổ vào thẻ Select
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    
    // Đọc parameters từ URL
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const keyword = searchParams.get("keyword") || "";
    const conversationId = searchParams.get("conversationId") || "";

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const columns = [
        { header: "Mã Tin nhắn", accessor: "_id" },
        { header: "Mã Hội thoại", accessor: "conversationId" },
        { 
            header: "Vai trò", 
            accessor: "role",
            // Format vai trò hiển thị đẹp hơn
            render: (row) => row.role === 'assistant' ? '🤖 Assistant' : '👤 User'
        },
        { 
            header: "Nội dung", 
            accessor: "content",
            render: (row) => <div className="truncate max-w-[300px]">{row.content}</div> 
        },
        { 
            header: "Thời gian", 
            accessor: "createdAt",
            render: (row) => new Date(row.createdAt).toLocaleString("vi-VN")
        },
    ];

    // Lấy danh sách Conversations đổ vào Dropdown
    useEffect(() => {
        const fetchConvs = async () => {
            try {
                // Gọi API lấy full không phân trang (hoặc limit lớn) để vào thẻ select
                const res = await getConversationsAPI({ limit: 100 });
                setConversations(res.data || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách hội thoại");
            }
        };
        fetchConvs();
    }, []);

    // Lấy danh sách Tin nhắn
    const fetchMessages = useCallback(async () => {
        try {
            const params = { page, limit, keyword, conversationId };
            const res = await getAllMessagesAPI(params);
            
            setMessages(res.data);
            setPagination(res.pagination);
            if(res.keyword) setSearchInput(res.keyword);
        } catch (error) {
            toast.error("Lỗi tải danh sách tin nhắn!");
        }
    }, [page, limit, keyword, conversationId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Update URL Params
    const updateParams = (newParams) => {
        const currentParams = Object.fromEntries([...searchParams]);
        setSearchParams({ ...currentParams, ...newParams });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateParams({ keyword: searchInput, page: 1 });
    };

    const handleConversationSelect = (val) => {
        if(val) {
            updateParams({ conversationId: val, page: 1 });
        } else {
            // Xóa param conversationId nếu chọn "Tất cả"
            const currentParams = Object.fromEntries([...searchParams]);
            delete currentParams.conversationId;
            setSearchParams({ ...currentParams, page: 1 });
        }
    };

    const confirmDelete = (id) => setDeleteModal({ isOpen: true, id });
    const closeDeleteModal = () => setDeleteModal({ isOpen: false, id: null });

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteMessageAPI(deleteModal.id);
            toast.success("Đã xóa tin nhắn!");
            if (messages.length === 1 && page > 1) {
                updateParams({ page: page - 1 });
            } else {
                fetchMessages();
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
                    Nhật ký Tin nhắn (Logs)
                </h1>
            </div>

            {/* Thanh Công cụ (Lọc & Tìm kiếm) */}
            <div className="bg-white shadow rounded-lg p-6 text-gray-800 mb-4 flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lọc theo Cuộc hội thoại:
                    </label>
                    <select
                        value={conversationId}
                        onChange={(e) => handleConversationSelect(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="">-- Tất cả Hội thoại --</option>
                        {conversations.map((conv) => (
                            <option key={conv._id} value={conv._id}>
                                {conv.title} ({conv._id.substring(0, 8)}...)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm:
                    </label>
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
                        <input
                            type="text"
                            placeholder="Nhập ID tin nhắn hoặc ID cuộc hội thoại..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                        <button 
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Tìm
                        </button>
                    </form>
                </div>
            </div>

            {/* Bảng Dữ liệu */}
            <div className="bg-white shadow rounded-lg p-6">
                <DataTable
                    columns={columns}
                    data={messages}
                    basePath="/admin/messages"
                    onDelete={confirmDelete}
                    actions={["view", "delete"]}
                />

                <Pagination
                    pagination={pagination}
                    items={messages}
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
                                Tin nhắn này sẽ được ẩn khỏi hệ thống (Xóa mềm).
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