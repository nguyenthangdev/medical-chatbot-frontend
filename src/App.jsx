// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// ================= LAYOUTS =================
import AdminLayout from './layouts/Admin/AdminLayout';
import AuthLayout from './layouts/Admin/AuthLayout'; 
import ClientLayout from './layouts/Client/ClientLayout'; 
import ClientAuthLayout from './layouts/Client/AuthLayout';

// ================= ADMIN PAGES =================
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
  const navigate = useNavigate(); // Lúc này gọi vô tư vì nó đã nằm trong BrowserRouter

  // Lắng nghe sự kiện bắt buộc đăng xuất từ Axios Interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      // Có thể hiển thị thêm một toast message thông báo hết hạn phiên đăng nhập ở đây
      navigate('/admin/login');
    };

    window.addEventListener('force-logout', handleForceLogout);
    return () => window.removeEventListener('force-logout', handleForceLogout);
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

// 2. COMPONENT APP CHÍNH CHỈ LÀM NHIỆM VỤ CUNG CẤP ROUTER BỌC BÊN NGOÀI
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;