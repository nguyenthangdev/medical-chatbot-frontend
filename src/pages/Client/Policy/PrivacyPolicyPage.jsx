import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const sections = [
  {
    title: 'Dữ liệu được lưu',
    body: 'MedBot có thể lưu thông tin tài khoản, hồ sơ cơ bản, lịch sử hội thoại và các thiết lập hiển thị để cung cấp trải nghiệm liên tục.',
  },
  {
    title: 'Cách dữ liệu được sử dụng',
    body: 'Dữ liệu được dùng để hiển thị lại lịch sử khám, cá nhân hóa giao diện và vận hành các tính năng hỏi đáp sức khỏe.',
  },
  {
    title: 'Quyền kiểm soát của bạn',
    body: 'Bạn có thể xóa từng đoạn hội thoại hoặc xóa toàn bộ lịch sử chat trong phần cài đặt tài khoản.',
  },
  {
    title: 'Lưu ý bảo mật',
    body: 'Không nên nhập giấy tờ tùy thân, mật khẩu, thông tin tài chính hoặc dữ liệu nhạy cảm không cần thiết vào cuộc trò chuyện.',
  },
];

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();

  return (
    <div className={`h-full overflow-y-auto ${isDarkMode ? 'bg-[#1f1f1f] text-gray-100' : 'bg-[#f9f9f9] text-gray-800'}`}>
      <div className="mx-auto max-w-3xl px-5 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`mb-8 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
        >
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-9 w-9 text-[#da7756]" />
          <h1 className="text-3xl font-bold">Chính sách quyền riêng tư</h1>
        </div>
        <p className={`mt-3 leading-7 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Trang này mô tả ngắn gọn cách MedBot xử lý dữ liệu trong phiên bản hiện tại.
        </p>

        <div className="mt-8 grid gap-4">
          {sections.map((section) => (
            <div key={section.title} className={`rounded-2xl border p-5 ${isDarkMode ? 'border-white/10 bg-[#2b2b29]' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-[#da7756]" />
                <h2 className="font-bold">{section.title}</h2>
              </div>
              <p className={`mt-2 text-sm leading-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
