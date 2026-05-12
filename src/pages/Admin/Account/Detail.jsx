/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAccountByIdAPI } from "../../../apis/Admin/account.api";

export default function AccountDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getAccountByIdAPI(id);
                setAccount(res.account);
            } catch (error) {
                toast.error("Không thể tải thông tin tài khoản!");
                navigate('/admin/accounts'); // Lỗi thì đá về danh sách
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>;
    if (!account) return null;

    return (
        <div className="max-w-3xl bg-white shadow-sm rounded-xl border border-gray-100 p-6 text-gray-800 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/accounts')} className="text-gray-500 hover:text-blue-600 font-medium">
                        &larr; Quay lại
                    </button>
                    <h2 className="text-2xl font-bold">Chi tiết tài khoản</h2>
                </div>
                
                <Link
                    to={`/admin/accounts/${account._id}/edit`}
                    className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition text-white font-medium"
                >
                    Chỉnh sửa
                </Link>
            </div>

            {/* Khối Profile */}
            <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                    {account.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="font-bold text-xl">{account.fullName}</div>
                    <div className="text-gray-500">{account.email}</div>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-sm">
                <div>
                    <div className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Vai trò (Role)</div>
                    <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-bold">
                        {account.role}
                    </span>
                </div>

                <div>
                    <div className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Trạng thái</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {account.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                </div>

                <div>
                    <div className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Ngày tạo</div>
                    <div className="font-medium text-gray-900">
                        {new Date(account.createdAt).toLocaleString('vi-VN')}
                    </div>
                </div>

                <div>
                    <div className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Cập nhật lần cuối</div>
                    <div className="font-medium text-gray-900">
                        {new Date(account.updatedAt).toLocaleString('vi-VN')}
                    </div>
                </div>
            </div>
        </div>
    );
}