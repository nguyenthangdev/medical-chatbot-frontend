// src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
    const navigate = useNavigate();

    const logout = () => {
        // 1. Xóa token hoặc dữ liệu user khỏi bộ nhớ (localStorage/sessionStorage)
        localStorage.removeItem('admin_token');

        // 2. Có thể gọi thêm API báo cho Backend biết user đã đăng xuất (nếu cần)
        // axios.post('/api/logout');

        // 3. Chuyển hướng về trang đăng nhập
        navigate('/login');
    };

    // Sau này bạn có thể thêm hàm login() vào đây
    const login = (token) => {
        localStorage.setItem('admin_token', token);
        navigate('/admin/dashboard');
    };

    return { logout, login };
}