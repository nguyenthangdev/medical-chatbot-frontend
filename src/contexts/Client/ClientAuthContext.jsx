/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { getMyProfileAPI } from '../../apis/Client/myProfile.api';
import CircularProgress from '@mui/material/CircularProgress'; 
import { fetchLogoutAPI } from '../../apis/Client/auth.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const ClientAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await getMyProfileAPI();
        if (res && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setAuthChecked(true);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setAuthChecked(true);
    };

    window.addEventListener('client-force-logout', handleForceLogout);
    return () => window.removeEventListener('client-force-logout', handleForceLogout);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  const logout = async () => {
    try {
      const res = await fetchLogoutAPI();
      if (res.code === 200) {
        toast.success(res.message);
      } else {
        toast.error("Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      navigate('/login');
    }
    setUser(null);
    setAuthChecked(true);
  };

  const refreshUser = async () => {
    try {
      const res = await getMyProfileAPI();
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu người dùng:", error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        isLoading, 
        isAuthenticated: authChecked && !!user, 
        logout, 
        refreshUser,
        authChecked 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải dùng bên trong ClientAuthProvider');
  return context;
};

export default AuthContext;