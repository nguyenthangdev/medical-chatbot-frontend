import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from './layouts/Admin/AdminLayout';
import AdminAuthLayout from './layouts/Admin/AdminAuthLayout';
import ClientLayout from './layouts/Client/ClientLayout';
import ClientAuthLayout from './layouts/Client/ClientAuthLayout';
import AdminLogin from './pages/Admin/Auth/AdminLogin';
import AdminRegister from './pages/Admin/Auth/AdminRegister';
import Dashboard from './pages/Admin/Dashboard/Index';
import ProfileDetail from './pages/Admin/Profile/Detail';
import ProfileEdit from './pages/Admin/Profile/Edit';
import UserIndex from './pages/Admin/User/Index';
import UserDetail from './pages/Admin/User/Detail';
import ConversationIndex from './pages/Admin/Conversation/Index';
import ConversationDetail from './pages/Admin/Conversation/Detail';
import MessageIndex from './pages/Admin/Message/Index';
import MessageDetail from './pages/Admin/Message/Detail';
import SettingIndex from './pages/Admin/Setting/Index';

import ChatPage from './pages/Client/ChatPage/ChatPage'
import SettingPage from './pages/Client/Setting/SettingPage';
import ClientLogin from './pages/Client/Auth/ClientLogin';
import ClientRegister from './pages/Client/Auth/ClientRegister';
import { ClientProviders } from './AppProviders'
import PrivateRouteClient from "./components/Client/PrivateRoute"
import UnauthorizedRoutesClient from "./components/Client/UnauthorizedRoutes"
import AccountIndex from './pages/Admin/Account/Index';
import AccountDetail from './pages/Admin/Account/Detail';
import AccountEdit from './pages/Admin/Account/Edit';
import AccountCreate from './pages/Admin/Account/Create';
import UserEdit from './pages/Admin/User/Edit';
import { AdminProviders } from './AppProviders';
import UnauthorizedRoutesAdmin from './components/Admin/UnauthorizedRoutes';
import PrivateRouteAdmin from './components/Admin/PrivateRoute ';
import Error404Page from './pages/404/Error404Page';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAdminForceLogout = () => {
      navigate('/admin/login');
    };

    const handleClientForceLogout = () => {
      navigate('/login');
    };

    window.addEventListener('force-logout', handleAdminForceLogout);
    window.addEventListener('client-force-logout', handleClientForceLogout);

    return () => {
      window.removeEventListener('force-logout', handleAdminForceLogout);
      window.removeEventListener('client-force-logout', handleClientForceLogout);
    };
  }, [navigate]);

  return (
    <Routes>
      {/* --- NHÓM CLIENT --- */}
      <Route path="/" element={
        <ClientProviders>
          <PrivateRouteClient>
            <ClientLayout />
          </PrivateRouteClient>
        </ClientProviders>
      }>
        <Route index element={<ChatPage />} />
        <Route path="settings" element={<SettingPage />} /> 
      </Route>

      <Route element={
        <ClientProviders>
          <UnauthorizedRoutesClient>
            <ClientAuthLayout />
          </UnauthorizedRoutesClient>
        </ClientProviders>
      }>
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<ClientRegister />} />
      </Route>
      {/* --- HẾT NHÓM CLIENT --- */}

      {/* --- NHÓM ADMIN --- */}
      <Route path="/admin" element={
        <AdminProviders>
          <PrivateRouteAdmin>
            <AdminLayout />
          </PrivateRouteAdmin>
        </AdminProviders>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-profile" element={<ProfileDetail />} />
        <Route path="my-profile/edit" element={<ProfileEdit />} />
        <Route path="users" element={<UserIndex />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/:id/edit" element={<UserEdit />} />
        <Route path="accounts" element={<AccountIndex />} />
        <Route path="accounts/:id" element={<AccountDetail />} />
        <Route path="accounts/create" element={<AccountCreate />} />
        <Route path="accounts/:id/edit" element={<AccountEdit />} />
        <Route path="conversations" element={<ConversationIndex />} />
        <Route path="conversations/:id" element={<ConversationDetail />} />
        <Route path="messages" element={<MessageIndex />} />
        <Route path="messages/:id" element={<MessageDetail />} />
        <Route path="settings" element={<SettingIndex />} />
      </Route>

      <Route element={
        <AdminProviders>
          <UnauthorizedRoutesAdmin>
            <AdminAuthLayout />
          </UnauthorizedRoutesAdmin>
        </AdminProviders>
      }>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/auth/register" element={<AdminRegister />} />
      </Route>
      {/* --- HẾT NHÓM ADMIN --- */}

      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default App;