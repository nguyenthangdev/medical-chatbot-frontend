import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from './layouts/Admin/AdminLayout';
import AuthLayout from './layouts/Admin/AuthLayout';
import ClientLayout from './layouts/Client/ClientLayout';
import ClientAuthLayout from './layouts/Client/AuthLayout';
import Login from './pages/Admin/Auth/Login';
import Register from './pages/Admin/Auth/Register';
import Dashboard from './pages/Admin/Dashboard/Index';
import AccountDetail from './pages/Admin/Account/Detail';
import AccountEdit from './pages/Admin/Account/Edit';
import UserIndex from './pages/Admin/User/Index';
import UserDetail from './pages/Admin/User/Detail';
import UserEdit from './pages/Admin/User/Edit';
import ConversationIndex from './pages/Admin/Conversation/Index';
import ConversationDetail from './pages/Admin/Conversation/Detail';
import MessageIndex from './pages/Admin/Message/Index';
import MessageDetail from './pages/Admin/Message/Detail';
import SettingIndex from './pages/Admin/Setting/Index';

// ================= CLIENT PAGES =================
import ChatPage from './pages/Client/ChatPage/ChatPage'
import SettingPage from './pages/Client/Setting/SettingPage';
import ClientLogin from './pages/Client/Auth/Login';
import ClientRegister from './pages/Client/Auth/Register';

// 1. TẠO COMPONENT CON CHỨA ROUTES VÀ HOOKS
function AppRoutes() {
  const navigate = useNavigate();

  // Lắng nghe sự kiện bắt buộc đăng xuất từ Axios Interceptor cho CẢ 2 BÊN
  useEffect(() => {
    // Xử lý khi Admin hết hạn token
    const handleAdminForceLogout = () => {
      navigate('/admin/login');
    };

    // Xử lý khi Client hết hạn token
    const handleClientForceLogout = () => {
      navigate('/login');
    };

    // Đăng ký lắng nghe
    window.addEventListener('force-logout', handleAdminForceLogout);
    window.addEventListener('client-force-logout', handleClientForceLogout);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener('force-logout', handleAdminForceLogout);
      window.removeEventListener('client-force-logout', handleClientForceLogout);
    };
  }, [navigate]);

  return (
    <Routes>
      {/* ================= CLIENT ROUTES ================= */}
      <Route element={<ClientAuthLayout />}>
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<ClientRegister />} />
      </Route>

      <Route path="/" element={<ClientLayout />}>
        <Route index element={<ChatPage />} />
        <Route path="settings" element={<SettingPage />} /> 
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-account" element={<AccountDetail />} />
        <Route path="my-account/edit" element={<AccountEdit />} />
        <Route path="users" element={<UserIndex />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/:id/edit" element={<UserEdit />} />
        <Route path="conversations" element={<ConversationIndex />} />
        <Route path="conversations/:id" element={<ConversationDetail />} />
        <Route path="messages" element={<MessageIndex />} />
        <Route path="messages/:id" element={<MessageDetail />} />
        <Route path="settings" element={<SettingIndex />} />
      </Route>

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
  );
}

export default App;