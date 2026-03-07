import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function UserDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data (giả lập API)
    const user = {
        id,
        name: "John Doe",
        email: "john@example.com",
        role: "User",
        status: "Active",
        phone: "+84 901 234 567",
        address: "Hanoi, Vietnam",
        createdAt: "2023-10-15"
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-3xl text-gray-800">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="text-gray-500 hover:text-black font-medium text-white"
                    >
                        ← Back
                    </button>

                    <h2 className="text-xl font-bold">
                        User Detail #{id}
                    </h2>

                </div>

                <Link
                    to={`/admin/users/${id}/edit`}
                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 text-white"
                >
                    Edit User
                </Link>

            </div>

            {/* User info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left */}
                <div className="space-y-3">

                    <p>
                        <span className="font-semibold w-28 inline-block">
                            Name:
                        </span>
                        {user.name}
                    </p>

                    <p>
                        <span className="font-semibold w-28 inline-block">
                            Email:
                        </span>
                        {user.email}
                    </p>

                    <p>
                        <span className="font-semibold w-28 inline-block">
                            Phone:
                        </span>
                        {user.phone}
                    </p>

                    <p>
                        <span className="font-semibold w-28 inline-block">
                            Address:
                        </span>
                        {user.address}
                    </p>

                </div>

                {/* Right */}
                <div className="space-y-3">

                    <p>
                        <span className="font-semibold w-28 inline-block">
                            Role:
                        </span>

                        <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                            {user.role}
                        </span>

                    </p>

                    <p>
                        <span className="font-semibold w-28 inline-block">
                            Status:
                        </span>

                        <span
                            className={`ml-2 text-xs font-medium px-2 py-1 rounded
                            ${user.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                }`}
                        >
                            {user.status}
                        </span>

                    </p>

                    <p>
                        <span className="font-semibold w-28 inline-block">
                            Created:
                        </span>
                        {user.createdAt}
                    </p>

                </div>

            </div>

        </div>
    );
}