import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext.jsx";

export default function ProfileDetail() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="max-w-2xl bg-white shadow-md rounded-xl p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-2xl bg-white shadow-md rounded-xl p-8 text-center text-red-500">
                Không thể tải thông tin tài khoản. Vui lòng thử lại sau.
            </div>
        );
    }

    const avatarLetter = (user.fullName || user.name || "A").charAt(0).toUpperCase();

    return (
        <div className="max-w-2xl bg-white shadow-md rounded-xl p-6 text-gray-800 transition-all duration-300">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                    Thông tin cá nhân
                </h2>
                <Link
                    to="/admin/my-profile/edit"
                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition text-white"
                >
                    Chỉnh sửa
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        avatarLetter
                    )}
                </div>

                <div>
                    <div className="font-semibold text-xl">
                        {user.fullName || user.name}
                    </div>
                    <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                        {user.roleName || user.role?.title || "Admin"}
                    </span>
                </div>
            </div>

            <hr className="mb-6 border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-sm">
                
                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Họ và tên</div>
                    <div className="font-medium text-gray-900">{user.fullName || user.name}</div>
                </div>

                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Email</div>
                    <div className="font-medium text-gray-900">{user.email}</div>
                </div>

                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Trạng thái</div>
                    <div>
                        <span className={`px-2 py-1 text-xs rounded font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </div>
                </div>

                <div>
                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Ngày tham gia</div>
                    <div className="font-medium text-gray-900">
                        {user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString('vi-VN') 
                            : "N/A"}
                    </div>
                </div>

            </div>

        </div>
    );
}