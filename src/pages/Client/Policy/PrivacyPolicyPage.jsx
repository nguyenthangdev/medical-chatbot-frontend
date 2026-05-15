import { ArrowLeft, Database, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const sections = [
  {
    icon: Database,
    title: 'Dữ liệu được lưu',
    body: 'Hệ thống có thể lưu thông tin tài khoản, hồ sơ cơ bản, lịch sử hội thoại và thiết lập hiển thị để duy trì trải nghiệm liên tục.',
  },
  {
    icon: UserCheck,
    title: 'Cách dữ liệu được sử dụng',
    body: 'Dữ liệu được dùng để hiển thị lại lịch sử khám, cá nhân hóa giao diện và vận hành các tính năng hỏi đáp sức khỏe.',
  },
  {
    icon: ShieldCheck,
    title: 'Quyền kiểm soát của bạn',
    body: 'Bạn có thể xóa từng đoạn hội thoại hoặc xóa toàn bộ lịch sử chat trong phần cài đặt tài khoản.',
  },
  {
    icon: LockKeyhole,
    title: 'Lưu ý bảo mật',
    body: 'Không nên nhập giấy tờ tùy thân, mật khẩu, thông tin tài chính hoặc dữ liệu nhạy cảm không cần thiết vào cuộc trò chuyện.',
  },
];

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();

  const pageBg = isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f5f9fc] text-slate-900';
  const cardClass = isDarkMode ? 'border-white/10 bg-slate-900' : 'border-sky-100 bg-white';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`h-full overflow-y-auto ${pageBg}`}>
      <div className="mx-auto max-w-4xl px-5 py-8 md:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`mb-8 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
            isDarkMode ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'border border-sky-100 bg-white text-slate-600 shadow-sm hover:bg-sky-50 hover:text-blue-700'
          }`}
        >
          <ArrowLeft size={18} /> Quay lại
        </button>

        <section className={`rounded-[28px] border p-6 shadow-sm md:p-8 ${cardClass}`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-3xl ${
              isDarkMode ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-blue-600'
            }`}>
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-600">Quyền riêng tư</p>
              <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">Chính sách quyền riêng tư</h1>
              <p className={`mt-3 max-w-2xl leading-7 ${mutedText}`}>
                Trang này mô tả ngắn gọn cách Bác sĩ Ảo xử lý dữ liệu trong phiên bản hiện tại.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className={`rounded-3xl border p-5 shadow-sm ${cardClass}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    isDarkMode ? 'bg-white/5 text-sky-300' : 'bg-sky-50 text-blue-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-bold">{section.title}</h2>
                </div>
                <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
                  {section.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
