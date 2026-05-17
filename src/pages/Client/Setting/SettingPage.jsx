/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { changeMyPasswordAPI, updateMyProfileAPI } from '../../../apis/Client/myProfile.api';
import { useAuth } from '../../../contexts/Client/ClientAuthContext.jsx';
import { deleteAllConversationsAPI } from '../../../apis/Client/chat.api.js';
import { ArrowLeft, KeyRound, LogOut, MonitorCog, Moon, Save, Sun, Trash2, Type, UserRound } from 'lucide-react'; 
import ConfirmDialog from '../../../components/Client/ConfirmDialog.jsx';
import PasswordStrength from '../../../components/Client/PasswordStrength.jsx';

const SettingPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const { refreshUser, user, isLoading, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const { fontSize, setFontSize, onChatHistoryCleared, isDarkMode, setIsDarkMode } = useOutletContext();

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

  const handlePasswordFieldChange = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
    setPasswordError('');
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeMyPasswordAPI(passwordForm);
      toast.success(res.message);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
      await logout();
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể đổi mật khẩu!';
      setPasswordError(message);
      // toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout()
  };

  const handleDeleteAllChats = async () => {
    setIsDeletingAll(true);
    try {
      const res = await deleteAllConversationsAPI();
      if (res.code === 200) {
        toast.success(res.message);
        setShowDeleteAllDialog(false);
        onChatHistoryCleared?.();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Xóa thất bại!");
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const pageBg = isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f5f9fc] text-slate-900';
  const cardClass = isDarkMode
    ? 'bg-[#111827] border-white/10 shadow-black/20'
    : 'bg-white border-sky-100 shadow-sky-100/70';
  const subtleCardClass = isDarkMode
    ? 'bg-white/5 border-white/10'
    : 'bg-sky-50/60 border-sky-100';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputClass = isDarkMode
    ? 'bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
    : 'bg-white border-sky-100 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/15';
  const selectedOptionClass = 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/15';
  const normalOptionClass = isDarkMode
    ? 'border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/5'
    : 'border-sky-100 text-slate-600 hover:border-sky-200 hover:bg-white';

  return (
    <div className={`flex h-full flex-col overflow-y-auto ${pageBg}`}>
      <div className={`sticky top-0 z-10 border-b backdrop-blur-xl ${
        isDarkMode ? 'border-white/10 bg-[#0f172a]/90' : 'border-sky-100 bg-white/85'
      }`}>
        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 py-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
              isDarkMode ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-white text-slate-700 shadow-sm ring-1 ring-sky-100 hover:bg-sky-50 hover:text-blue-700'
            }`}
            aria-label="Quay lại"
          >
            <ArrowLeft size={21} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">Cài đặt</h1>
            <p className={`mt-0.5 text-sm ${mutedText}`}>Quản lý hồ sơ, giao diện và dữ liệu hội thoại của bạn.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className={`rounded-3xl border p-6 shadow-sm ${cardClass}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <UserRound size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold">Thông tin của bạn</h2>
                  <p className={`mt-1 text-sm ${mutedText}`}>Cập nhật tên hiển thị trong khu vực khách hàng.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Họ và tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full rounded-2xl border px-4 py-3 text-base outline-none ring-4 ring-transparent transition ${inputClass}`}
                    placeholder="Nhập họ và tên..."
                  />
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tài khoản</label>
                  <input
                    type="text"
                    defaultValue={user?.email || user?.phone || ""}
                    className={`w-full rounded-2xl border px-4 py-3 text-base outline-none ${
                      isDarkMode ? 'border-white/10 bg-white/5 text-gray-400' : 'border-gray-200 bg-gray-100 text-gray-500'
                    }`}
                    disabled
                  />
                  <span className={`mt-2 block text-xs ${mutedText}`}>Tên tài khoản không thể thay đổi.</span>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 shadow-sm ${cardClass}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <KeyRound size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
                  <p className={`mt-1 text-sm ${mutedText}`}>Nhập mật khẩu hiện tại trước khi tạo mật khẩu mới.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordFieldChange('currentPassword', e.target.value)}
                    className={`w-full rounded-2xl border px-4 py-3 text-base outline-none ring-4 ring-transparent transition ${inputClass}`}
                    placeholder="Nhập mật khẩu hiện tại"
                    autoComplete="current-password"
                  />
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordFieldChange('newPassword', e.target.value)}
                    className={`w-full rounded-2xl border px-4 py-3 text-base outline-none ring-4 ring-transparent transition ${inputClass}`}
                    placeholder="Tạo mật khẩu mới"
                    autoComplete="new-password"
                  />
                  <PasswordStrength
                    password={passwordForm.newPassword}
                    error={passwordError ? { message: passwordError } : null}
                  />
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordFieldChange('confirmPassword', e.target.value)}
                    className={`w-full rounded-2xl border px-4 py-3 text-base outline-none ring-4 ring-transparent transition ${inputClass}`}
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <KeyRound size={17} />
                  {isChangingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 shadow-sm ${cardClass}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <MonitorCog size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold">Tùy chỉnh hiển thị</h2>
                  <p className={`mt-1 text-sm ${mutedText}`}>Điều chỉnh giao diện đọc chat theo thói quen của bạn.</p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className={`rounded-3xl border p-4 ${subtleCardClass}`}>
                  <div className="mb-4 flex items-center gap-2">
                    <Type size={18} className="text-blue-600" />
                    <p className="font-semibold">Kích thước chữ trong đoạn chat</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleChangeFontSize('small')}
                      className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                        fontSize === 'small' ? selectedOptionClass : normalOptionClass
                      }`}
                    >
                      Nhỏ
                    </button>
                    <button
                      onClick={() => handleChangeFontSize('medium')}
                      className={`rounded-2xl border px-4 py-3 text-base font-bold transition ${
                        fontSize === 'medium' ? selectedOptionClass : normalOptionClass
                      }`}
                    >
                      Vừa
                    </button>
                    <button
                      onClick={() => handleChangeFontSize('large')}
                      className={`rounded-2xl border px-4 py-3 text-lg font-bold transition ${
                        fontSize === 'large' ? selectedOptionClass : normalOptionClass
                      }`}
                    >
                      To
                    </button>
                  </div>
                </div>

                <div className={`rounded-3xl border p-4 ${subtleCardClass}`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">Giao diện</p>
                      <p className={`mt-1 text-sm ${mutedText}`}>Chọn chế độ sáng hoặc tối cho khu vực khách hàng.</p>
                    </div>
                    <div className={`inline-flex rounded-2xl border p-1 ${
                      isDarkMode ? 'border-white/10 bg-black/25' : 'border-sky-100 bg-white'
                    }`}>
                      <button
                        type="button"
                        onClick={() => setIsDarkMode(false)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                          !isDarkMode ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <Sun size={16} /> Sáng
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDarkMode(true)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                          isDarkMode ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-sky-50'
                        }`}
                      >
                        <Moon size={16} /> Tối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className={`rounded-3xl border p-6 shadow-sm ${cardClass}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-base font-bold text-white">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold">{user?.fullName || 'Người dùng Bác sĩ Ảo'}</p>
                  <p className={`truncate text-sm ${mutedText}`}>{user?.email || user?.phone || 'Tài khoản miễn phí'}</p>
                </div>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 shadow-sm ${
              isDarkMode ? 'border-red-500/20 bg-red-500/10' : 'border-red-100 bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-red-600">Vùng nguy hiểm</h2>
                  <p className={`mt-1 text-sm leading-6 ${isDarkMode ? 'text-red-200/80' : 'text-red-700/80'}`}>
                    Các hành động dưới đây không thể hoàn tác.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteAllDialog(true)}
                disabled={isDeletingAll}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={17} /> {isDeletingAll ? 'Đang xóa...' : 'Xóa tất cả lịch sử chat'}
              </button>
            </section>

            <section className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isDarkMode ? 'bg-white/5 text-gray-100 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LogOut size={17} /> {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất tài khoản'}
              </button>
            </section>
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteAllDialog}
        title="Xóa tất cả lịch sử chat?"
        description="Toàn bộ lịch sử khám và các tin nhắn đã lưu sẽ bị xóa khỏi tài khoản của bạn. Hành động này không thể hoàn tác."
        confirmText="Xóa tất cả"
        loading={isDeletingAll}
        onCancel={() => {
          if (!isDeletingAll) setShowDeleteAllDialog(false);
        }}
        onConfirm={handleDeleteAllChats}
      />
    </div>
  );
};

export default SettingPage;
