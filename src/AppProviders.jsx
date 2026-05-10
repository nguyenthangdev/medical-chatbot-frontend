import { composeProviders } from './ComposeProviders'
import { ClientAuthProvider } from './contexts/Client/ClientAuthContext'
import { AdminAuthProvider } from './contexts/Admin/AdminAuthContext'

// Nhóm Client: Chỉ bọc các trang người dùng
export const ClientProviders = composeProviders(
  ClientAuthProvider
)

// Nhóm Admin: Chỉ bọc các trang quản trị
export const AdminProviders = composeProviders(
  AdminAuthProvider
)