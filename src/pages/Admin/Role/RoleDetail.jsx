/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getRoleDetailAPI } from "../../../apis/Admin/role.api";
import { useOutletContext } from "react-router-dom"; // Giả sử quyền được lưu trong context

export default function RoleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roleDetail, setRoleDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Lấy thông tin user/role hiện tại từ context để check quyền (giống các file cũ)
    const { userRole } = useOutletContext(); 

    useEffect(() => {
        // Kiểm tra quyền xem
        if (userRole && !userRole.permissions.includes('roles_view')) {
            toast.error("Bạn không có quyền truy cập trang này!");
            const timer = setTimeout(() => navigate('/admin/dashboard'), 2000);
            return () => clearTimeout(timer);
        }

        const fetchDetail = async () => {
            try {
                const res = await getRoleDetailAPI(id);
                setRoleDetail(res);
            } catch (error) {
                toast.error("Không tìm thấy thông tin nhóm quyền!");
                navigate("/admin/roles");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate, userRole]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 bg-white p-8 shadow-sm rounded-xl animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-100 rounded w-1/2"></div>
                <div className="h-32 bg-gray-50 rounded w-full"></div>
            </div>
        );
    }

    if (!roleDetail) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate('/admin/roles')}
                    className="text-gray-500 hover:text-gray-800 transition"
                >
                    ⬅️ Quay lại
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Chi tiết nhóm quyền</h1>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-8 space-y-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-6">
                    <div>
                        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tên nhóm quyền</label>
                        <p className="text-xl font-bold text-gray-800 mt-1">{roleDetail.title}</p>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mã định danh (ID)</label>
                        <p className="text-lg font-mono text-blue-600 mt-1 bg-blue-50 px-3 py-1 rounded-md inline-block">
                            {roleDetail.titleId}
                        </p>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mô tả nhóm quyền</label>
                    <div 
                        className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed markdown-content"
                        dangerouslySetInnerHTML={{ __html: roleDetail.description || '<i class="text-gray-400">Không có mô tả</i>' }}
                    />
                </div>

                <div className="flex items-center justify-between pt-6 border-t mt-8">
                    <div className="text-sm text-gray-400">
                        Ngày tạo: {new Date(roleDetail.createdAt).toLocaleString("vi-VN")}
                    </div>
                    
                    <div className="flex gap-3">
                        {/* Ẩn nút sửa nếu là Super Admin (Bảo vệ hệ thống) */}
                        {!roleDetail.isSystemAdmin && (
                            <Link
                                to={`/admin/roles/${id}/edit`}
                                className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-sm"
                            >
                                ✏️ Chỉnh sửa
                            </Link>
                        )}
                        <Link
                            to="/admin/roles"
                            className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            Đóng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}