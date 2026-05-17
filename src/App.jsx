import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from './layouts/Admin/AdminLayout';
import AdminAuthLayout from './layouts/Admin/AdminAuthLayout';
import ClientLayout from './layouts/Client/ClientLayout';
import ClientAuthLayout from './layouts/Client/ClientAuthLayout';
import AdminLogin from './pages/Admin/Auth/AdminLogin';
import AdminRegister from './pages/Admin/Auth/AdminRegister';
import Dashboard from './pages/Admin/Dashboard/Index';
import BIIndex from './pages/Admin/BI/Index';
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
import UpgradePage from './pages/Client/Upgrade/UpgradePage';
import UsagePolicyPage from './pages/Client/Policy/UsagePolicyPage';
import PrivacyPolicyPage from './pages/Client/Policy/PrivacyPolicyPage';
import ClientLogin from './pages/Client/Auth/ClientLogin';
import ClientRegister from './pages/Client/Auth/ClientRegister';
import ClientForgotPassword from './pages/Client/Auth/ClientForgotPassword';
import ClientResetPassword from './pages/Client/Auth/ClientResetPassword';
import ClientVerifyEmail from './pages/Client/Auth/ClientVerifyEmail';
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
import PrivateRouteAdmin from './components/Admin/PrivateRoute';
import Error404Page from './pages/404/Error404Page';
import RoleIndex from "./pages/Admin/Role/Index"
import RoleForm from "./components/Admin/RoleForm"
import PermissionIndex from "./pages/Admin/Permission/PermissionIndex"
import RoleDetail from "./pages/Admin/Role/Detail"

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
        <Route path="chat/:id" element={<ChatPage />} />
        <Route path="upgrade" element={<UpgradePage />} />
        <Route path="usage-policy" element={<UsagePolicyPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
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
        <Route path="/verify-email" element={<ClientVerifyEmail />} />
        <Route path="/forgot-password" element={<ClientForgotPassword />} />
        <Route path="/reset-password/:token" element={<ClientResetPassword />} />
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
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        <Route path="dashboard" element={<BIIndex />} />
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
        <Route path="roles" element={<RoleIndex />} />
        <Route path="roles/create" element={<RoleForm />} />
        <Route path="roles/:id" element={<RoleDetail />} />
        <Route path="roles/:id/edit" element={<RoleForm />} />
        <Route path="permissions" element={<PermissionIndex />} />
      </Route>

      <Route element={
        <AdminProviders>
          <UnauthorizedRoutesAdmin>
            <AdminAuthLayout />
          </UnauthorizedRoutesAdmin>
        </AdminProviders>
      }>
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/auth/register" element={<AdminRegister />} /> */}
      </Route>
      {/* --- HẾT NHÓM ADMIN --- */}

      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default App;
