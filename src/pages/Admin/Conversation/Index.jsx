import React, { useEffect } from "react";
import DataTable from "../../../components/Admin/DataTable";
import { useAdminChat } from "../../../hooks/Admin/useAdminChat";

export default function ConversationIndex() {
    const {
        conversations,
        loading,
        error,
        fetchConversations,
        deleteConversationItem
    } = useAdminChat();

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const columns = [
        { header: "ID", accessor: "_id" },
        { header: "User ID", accessor: "userId" },
        { header: "Title", accessor: "title" },
        { header: "Model", accessor: "model" },
        { header: "Last Updated", accessor: "updatedAt" },
    ];

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa cuộc hội thoại này?")) {
            await deleteConversationItem(id);
        }
    };

    if (error) {
        return (
            <div className="text-red-600 p-4">
                Error: {error}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Conversation Management
                </h1>
            </div>

            {loading && <div className="text-blue-600 p-4">Đang tải...</div>}

            <DataTable
                title="Conversation List"
                columns={columns}
                data={conversations}
                basePath="/admin/conversations"
                onDelete={handleDelete}
                actions={["view", "delete"]}
            />
        </div>
    );
}