import React from "react";
import DataTable from "../../../components/Admin/DataTable";

export default function ConversationIndex() {

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "User", accessor: "user" },
        { header: "Topic", accessor: "topic" },
        { header: "Last Updated", accessor: "lastUpdated" },
        { header: "Status", accessor: "status" },
    ];

    const conversations = [
        {
            id: "C001",
            user: "Nguyen Van A",
            topic: "Fever symptoms consultation",
            lastUpdated: "10 minutes ago",
            status: "Active",
        },
        {
            id: "C002",
            user: "Tran Thi B",
            topic: "Stomach medicine advice",
            lastUpdated: "1 hour ago",
            status: "Closed",
        },
    ];

    const handleDelete = (id) => {
        console.log("delete conversation", id);
    };

    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Conversation Management
                </h1>

            </div>

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