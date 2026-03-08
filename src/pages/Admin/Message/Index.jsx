import React from "react";
import DataTable from "../../../components/Admin/DataTable";

export default function MessageIndex() {

    const columns = [
        { header: "Message ID", accessor: "id" },
        { header: "Conversation ID", accessor: "conversationId" },
        { header: "Sender", accessor: "sender" },
        { header: "Content Preview", accessor: "contentSnippet" },
        { header: "Timestamp", accessor: "timestamp" },
    ];

    const messages = [
        {
            id: "M101",
            conversationId: "C001",
            sender: "User",
            contentSnippet: "I have a headache...",
            timestamp: "08:00 AM 15 Oct",
        },
        {
            id: "M102",
            conversationId: "C001",
            sender: "Bot",
            contentSnippet: "Hello, do you also feel nausea...",
            timestamp: "08:01 AM 15 Oct",
        },
        {
            id: "M103",
            conversationId: "C002",
            sender: "User",
            contentSnippet: "How should I take this medicine?",
            timestamp: "09:15 AM 15 Oct",
        },
    ];

    const handleDelete = (id) => {
        console.log("delete message", id);
    };

    return (
        <div>

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Message Logs
                </h1>

            </div>

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