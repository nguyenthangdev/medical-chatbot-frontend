import React, { useEffect, useState } from "react";
import DataTable from "../../../components/Admin/DataTable";
import { useAdminChat } from "../../../hooks/Admin/useAdminChat";

export default function MessageIndex() {
    const {
        messages,
        conversations,
        loading,
        error,
        fetchConversations,
        selectConversation,
        deleteMessageItem
    } = useAdminChat();

    const [selectedConversationFilter, setSelectedConversationFilter] = useState(null);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const columns = [
        { header: "Message ID", accessor: "_id" },
        { header: "Conversation ID", accessor: "conversationId" },
        { header: "Role", accessor: "role" },
        { header: "Content", accessor: "content" },
        { header: "Timestamp", accessor: "createdAt" },
    ];

    const handleConversationSelect = async (conversationId) => {
        setSelectedConversationFilter(conversationId);
        await selectConversation(conversationId);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa tin nhắn này?")) {
            await deleteMessageItem(id);
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
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Message Logs
                </h1>
            </div>

            {/* Filter by Conversation */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Conversation:
                </label>
                <select
                    value={selectedConversationFilter || ""}
                    onChange={(e) => handleConversationSelect(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">-- Select Conversation --</option>
                    {conversations.map((conv) => (
                        <option key={conv._id} value={conv._id}>
                            {conv.title} ({conv._id})
                        </option>
                    ))}
                </select>
            </div>

            {loading && <div className="text-blue-600 p-4">Đang tải...</div>}

            {/* Table */}
            <DataTable
                title="System Message History"
                columns={columns}
                data={messages}
                basePath="/admin/messages"
                onDelete={handleDelete}
                actions={["view", "delete"]}
            />
        </div>
    );
}