// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Pages
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;