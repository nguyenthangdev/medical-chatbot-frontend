import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import hàm gọi API lấy thông tin tài khoản
// (Bạn nhớ kiểm tra lại đường dẫn import cho khớp với thư mục của bạn nhé)
import { fetchMyAccountAPI } from "../../../apis/Admin/myAccount.api";

export default function AccountDetail() {
    // State lưu trữ dữ liệu tài khoản
    const [profile, setProfile] = useState(null);
    // State quản lý trạng thái loading
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                // Gọi API (Axios Interceptor sẽ tự động đính kèm Cookie chứa token)
                const res = await fetchMyAccountAPI();
                
                // Tùy thuộc vào cấu trúc Backend trả về, bạn gán cho đúng nhé
                // Giả sử Backend trả về: { message: "...", accountAdmin: { fullName, email, ... } }
                setProfile(res.accountAdmin || res.data || res);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin tài khoản:", error);
            } finally {
                setIsLoading(false); // Tắt loading dù thành công hay thất bại
            }
        };

        fetchAccountDetails();
    }, []);

    // Giao diện khi đang tải dữ liệu
    if (isLoading) {
        return (
            <div className="max-w-2xl bg-white shadow-md rounded-xl p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Giao diện khi không lấy được dữ liệu (hoặc bị lỗi)
    if (!profile) {
        return (
            <div className="max-w-2xl bg-white shadow-md rounded-xl p-8 text-center text-red-500">
                Không thể tải thông tin tài khoản. Vui lòng thử lại sau.
            </div>
        );
    }

    // Lấy chữ cái đầu tiên của tên làm Avatar mặc định
    const avatarLetter = (profile.fullName || profile.name || "A").charAt(0).toUpperCase();

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-xl p-6 text-gray-800 transition-all duration-300">

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

            {/* Profile Overview */}
            <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        avatarLetter
                    )}
                </div>

                <div>
                    <div className="font-semibold text-xl">
                        {profile.fullName || profile.name}
                    </div>
                    <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                        {/* Nếu backend có trả về tên role thì hiển thị, không thì để mặc định */}
                        {profile.roleName || profile.role?.title || "Admin"}
                    </span>
                </div>
            </div>

            <hr className="mb-6 border-gray-100" />

            {/* Info Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-sm">
                
                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Full Name</div>
                    <div className="font-medium text-gray-900">{profile.fullName || profile.name}</div>
                </div>

                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Email</div>
                    <div className="font-medium text-gray-900">{profile.email}</div>
                </div>

                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Status</div>
                    <div>
                        <span className={`px-2 py-1 text-xs rounded font-medium ${profile.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {profile.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </div>
                </div>

                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Joined Date</div>
                    <div className="font-medium text-gray-900">
                        {profile.createdAt 
                            ? new Date(profile.createdAt).toLocaleDateString('vi-VN') 
                            : "N/A"}
                    </div>
                </div>

            </div>

        </div>
    );
}