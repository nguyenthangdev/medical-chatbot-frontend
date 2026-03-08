import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserEdit() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "John Doe",
        email: "john@email.com",
        role: "User"
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("update user", form);

        navigate(`/admin/users/${id}`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-lg text-gray-800">

            <h2 className="text-xl font-semibold mb-4">
                Edit User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1 font-medium">
                        Name
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Email
                    </label>

                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Role
                    </label>

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option>User</option>
                        <option>Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Save
                </button>

            </form>

        </div>
    );
}