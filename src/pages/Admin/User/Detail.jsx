/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserByIdAPI } from "../../../apis/Admin/user.api";

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getUserByIdAPI(id);
                setUser(res.data);
            } catch (error) {
                toast.error("Không tìm thấy người dùng!");
                navigate("/admin/users");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (!user) return null;

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-3xl text-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="text-gray-500 hover:text-blue-600 font-medium"
                    >
                        ← Quay lại
                    </button>
                    <h2 className="text-xl font-bold">
                        Chi tiết Người dùng
                    </h2>
                </div>
                <Link to={`/admin/users/${id}/edit`} className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 text-white transition">Chỉnh sửa</Link>
            </div>

            {/* Thông tin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột trái */}
                <div className="space-y-4">
                    <p className="flex flex-col">
                        <span className="text-gray-500 text-sm font-semibold uppercase">Họ và tên</span>
                        <span className="text-lg font-medium">{user.fullName || "Chưa cập nhật"}</span>
                    </p>
                    <p className="flex flex-col">
                        <span className="text-gray-500 text-sm font-semibold uppercase">Email</span>
                        <span className="text-lg">{user.email || "Chưa cập nhật"}</span>
                    </p>
                    <p className="flex flex-col">
                        <span className="text-gray-500 text-sm font-semibold uppercase">Số điện thoại</span>
                        <span className="text-lg">{user.phone || "Chưa cập nhật"}</span>
                    </p>
                </div>

                {/* Cột phải */}
                <div className="space-y-4">
                    <p className="flex flex-col">
                        <span className="text-gray-500 text-sm font-semibold uppercase mb-1">Trạng thái</span>
                        <span className={`w-max text-xs font-bold px-3 py-1.5 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                            {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </p>
                    <p className="flex flex-col">
                        <span className="text-gray-500 text-sm font-semibold uppercase">Ngày đăng ký</span>
                        <span className="text-lg">{new Date(user.createdAt).toLocaleString('vi-VN')}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}