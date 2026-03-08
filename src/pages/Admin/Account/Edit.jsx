import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function AccountEdit() {

    const navigate = useNavigate();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: "Super Admin",
            email: "admin@medicalbot.com",
        },
    });

    const onSubmit = (data) => {
        console.log("Update profile:", data);
        navigate("/admin/my-account");
    };

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-xl p-6 text-gray-800">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">

                <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:text-black"
                >
                    ← Back
                </button>

                <h2 className="text-2xl font-semibold">
                    Edit Account
                </h2>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Full Name
                    </label>

                    <input
                        type="text"
                        {...register("name")}
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        {...register("email")}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />

                    <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 text-white px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}