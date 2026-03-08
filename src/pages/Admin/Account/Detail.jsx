import React from "react";
import { Link } from "react-router-dom";

export default function AccountDetail() {

    const profile = {
        name: "Super Admin",
        email: "admin@medicalbot.com",
        role: "Super Admin",
        joined: "Jan 1, 2024",
    };

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-xl p-6 text-gray-800">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-semibold">
                    Account Information
                </h2>

                <Link
                    to="/admin/my-account/edit"
                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition text-white"
                >
                    Edit Profile
                </Link>

            </div>

            {/* Profile */}
            <div className="flex items-center gap-4 mb-6">

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                    A
                </div>

                <div>
                    <div className="font-semibold text-lg">
                        {profile.name}
                    </div>

                    <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-600">
                        {profile.role}
                    </span>
                </div>

            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-y-4 text-sm">

                <div className="text-gray-500">Full Name</div>
                <div>{profile.name}</div>

                <div className="text-gray-500">Email</div>
                <div>{profile.email}</div>

                <div className="text-gray-500">Role</div>
                <div>{profile.role}</div>

                <div className="text-gray-500">Joined</div>
                <div>{profile.joined}</div>

            </div>

        </div>
    );
}