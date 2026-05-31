import { useNavigate } from "react-router-dom";
import { fetchLogoutAPI } from "../../apis/Admin/auth.api";

export default function useAuth() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await fetchLogoutAPI();
            
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        } finally {
            navigate("/admin/login");
        }
    };

    return {
        logout
    };
}