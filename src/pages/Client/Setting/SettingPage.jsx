import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Đừng quên import toast để hiển thị thông báo nhé
import { fetchLogoutAPI } from '../../../apis/Client/auth.api';
import { getMyAccountAPI, updateMyAccountAPI } from '../../../apis/Client/myAccount.api'; // Thêm API update

const SettingPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // State lưu thông tin người dùng
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý việc cập nhật
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // State quản lý size chữ (UI demo)
  const { fontSize, setFontSize } = useOutletContext();
  
  // 1. GỌI API LẤY THÔNG TIN
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getMyAccountAPI();
        setUser(res.user);
        setFullName(res.user.fullName); // Đổ dữ liệu vào state để edit
      } catch (error) {
        console.error("Lỗi khi tải thông tin cá nhân:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 2. HÀM CẬP NHẬT THÔNG TIN
  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên của bạn!");
      return;
    }

    // Nếu tên không đổi thì không gọi API cho đỡ tốn tài nguyên
    if (fullName === user.fullName) {
      toast.info("Thông tin không có gì thay đổi!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateMyAccountAPI({ fullName });
      setUser(res.user); // Cập nhật lại state user với data mới nhất
      toast.success("Lưu thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      // Lỗi thì Axios Interceptor đã tự toast rồi, không cần bắt ở đây nữa, hoặc có thể custom thêm
    } finally {
      setIsSaving(false);
    }
  };

  // Hàm xử lý khi bấm đổi cỡ chữ
  const handleChangeFontSize = (size) => {
    setFontSize(size); // Đổi trên giao diện ngay lập tức
    localStorage.setItem('chatFontSize', size); // Lưu vào bộ nhớ máy để F5 không mất
  };

  // 3. HÀM ĐĂNG XUẤT (Nhớ giữ lại vụ xóa cờ nha)
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetchLogoutAPI(); // Gọi BE để xóa HTTP-Only Cookie
      localStorage.removeItem('isClientLogged'); // Xóa cờ báo hiệu đã login
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      navigate('/login'); // Dù lỗi hay không cũng cho ra ngoài
    }
  };

  // Màn hình loading khi đang lấy dữ liệu
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
                onClick={() => handleChangeFontSize('small')} // Gọi hàm mới
                className={`flex-1 py-3 border-2 rounded-xl text-lg transition-colors ${fontSize === 'small' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-300'}`}
              >
                Nhỏ
              </button>
              <button 
                onClick={() => handleChangeFontSize('medium')} // Gọi hàm mới
                className={`flex-1 py-3 border-2 rounded-xl text-lg transition-colors ${fontSize === 'medium' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-300'}`}
              >
                Vừa
              </button>
              <button 
                onClick={() => handleChangeFontSize('large')} // Gọi hàm mới
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