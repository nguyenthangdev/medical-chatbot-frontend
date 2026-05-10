import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { updateMyProfileAPI } from '../../../apis/Client/myProfile.api';
import { useAuth } from '../../../contexts/Client/ClientAuthContext.jsx';

const SettingPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { refreshUser, user, isLoading, logout } = useAuth();


  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { fontSize, setFontSize } = useOutletContext();

  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên của bạn!");
      return;
    }

    if (fullName === user.fullName) {
      toast.info("Thông tin không có gì thay đổi!");
      return;
    }
    setIsSaving(true);
    try {
      await updateMyProfileAPI({ fullName });
      await refreshUser(); 
      toast.success("Lưu thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeFontSize = (size) => {
    setFontSize(size); 
    localStorage.setItem('chatFontSize', size); 
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout()
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate('/')}
          className="text-3xl text-blue-600 hover:text-blue-800 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 transition-colors"
        >
          ⬅️
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
      </div>

      {/* Nội dung Cài đặt */}
      <div className="max-w-3xl w-full mx-auto p-6 space-y-6 mt-4">
        
        {/* Khối 1: Thông tin cá nhân */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            👤 Thông tin của bạn
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-2">Họ và tên</label>
              <input 
                type="text" 
                value={fullName} // Chuyển sang dùng value và onChange
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg focus:border-blue-500 outline-none transition-colors"
                placeholder="Nhập họ và tên..."
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">Tài khoản (Email / SĐT)</label>
              <input 
                type="text" 
                defaultValue={user?.email || user?.phone || ""} 
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg bg-gray-100 text-gray-500 outline-none"
                disabled
              />
              <span className="text-sm text-gray-400 mt-1 block">* Tên tài khoản không thể thay đổi</span>
            </div>
            
            <button 
              onClick={handleUpdateProfile}
              disabled={isSaving}
              className={`font-bold py-3 px-6 rounded-xl text-lg mt-2 transition-colors ${
                isSaving 
                  ? 'bg-blue-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </div>

        {/* Khối 2: Tùy chỉnh hiển thị */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            🔤 Tùy chỉnh hiển thị
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 font-medium">Kích thước chữ trong đoạn chat</p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleChangeFontSize('small')}
                className={`flex-1 py-3 border-2 rounded-xl text-lg transition-colors ${fontSize === 'small' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-300'}`}
              >
                Nhỏ
              </button>
              <button 
                onClick={() => handleChangeFontSize('medium')}
                className={`flex-1 py-3 border-2 rounded-xl text-lg transition-colors ${fontSize === 'medium' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-300'}`}
              >
                Vừa
              </button>
              <button 
                onClick={() => handleChangeFontSize('large')}
                className={`flex-1 py-3 border-2 rounded-xl text-xl transition-colors ${fontSize === 'large' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-300'}`}
              >
                To
              </button>
            </div>
          </div>
        </div>

        {/* Khối 3: Đăng xuất */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mt-6">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-100 text-red-600 hover:bg-red-200 font-bold py-4 rounded-xl text-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>🚪</span> {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất tài khoản'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingPage;