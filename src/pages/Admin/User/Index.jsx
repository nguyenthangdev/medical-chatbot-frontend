import React from "react";
import DataTable from "../../../components/Admin/DataTable";

export default function UserIndex() {

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
        { header: "Status", accessor: "status" },
    ];

    const users = [
        { id: 1, name: "John Doe", email: "john@email.com", role: "User", status: "Active" },
        { id: 2, name: "Anna Smith", email: "anna@email.com", role: "Doctor", status: "Active" },
        { id: 3, name: "David Lee", email: "david@email.com", role: "User", status: "Locked" },
    ];

    const handleDelete = (id) => {
        console.log("delete user", id);
    };

    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    User Management
                </h1>

                <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    + Add User
                </button>

            </div>

            <DataTable
                title="User List"
                columns={columns}
                data={users}
                basePath="/admin/users"
                onDelete={handleDelete}
            />

        </div>
    );
}