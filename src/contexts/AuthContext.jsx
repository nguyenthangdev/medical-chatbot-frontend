/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { getMyAccountAPI } from '../apis/Client/myAccount.api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // đang check auth

  // Khi app khởi động, tự động lấy thông tin user nếu đã đăng nhập
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getMyAccountAPI()
        setUser(res.user)
      } catch {
        // Token hết hạn hoặc chưa đăng nhập → user = null
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchCurrentUser()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook tiện dụng để dùng trong component
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth phải dùng bên trong AuthProvider')
  return context
}

export default AuthContext