// src/hooks/useAuth.js
import { useNavigate } from "react-router-dom";
import { fetchLogoutAPI } from "../apis/Admin/auth.api";

export default function useAuth() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            // 1. Gọi API báo Backend xóa HTTP-Only Cookie
            await fetchLogoutAPI();
            
            // (Tùy chọn) Nếu bạn có dùng Redux, Context, hay Zustand để lưu thông tin user 
            // thì reset state về null ở đây. Ví dụ: setUser(null);

        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        } finally {
            // 2. Chuyển hướng về trang đăng nhập
            navigate("/admin/login");
        }
    };

    return {
        logout
    };
}