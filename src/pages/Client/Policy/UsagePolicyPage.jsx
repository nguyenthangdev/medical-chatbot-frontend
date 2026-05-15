import { AlertTriangle, ArrowLeft, CheckCircle2, Stethoscope } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const items = [
  'Bác sĩ Ảo chỉ cung cấp thông tin sức khỏe tham khảo, không thay thế bác sĩ hoặc cơ sở y tế.',
  'Không sử dụng hệ thống để tự chẩn đoán, tự kê đơn, thay đổi liều thuốc hoặc trì hoãn việc đi khám.',
  'Với triệu chứng nguy hiểm như đau ngực, khó thở, ngất, co giật, chảy máu nhiều hoặc ý định tự làm hại bản thân, hãy gọi cấp cứu hoặc đến cơ sở y tế gần nhất.',
  'Không nhập thông tin cá nhân nhạy cảm của người khác nếu bạn không có quyền chia sẻ.',
  'Không dùng hệ thống để tạo nội dung gây hại, sai lệch y tế, lừa đảo hoặc vi phạm pháp luật.',
];

const UsagePolicyPage = () => {
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
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-600">An toàn y tế</p>
              <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">Chính sách sử dụng</h1>
              <p className={`mt-3 max-w-2xl leading-7 ${mutedText}`}>
                Những nguyên tắc dưới đây giúp Bác sĩ Ảo được dùng đúng mục đích và an toàn trong các tình huống liên quan đến sức khỏe.
              </p>
            </div>
          </div>
        </section>

        <div className={`mt-6 rounded-3xl border p-5 shadow-sm md:p-6 ${cardClass}`}>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={item} className="flex gap-3 text-base leading-7">
                {index === 2 ? (
                  <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-rose-500" />
                ) : (
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
                )}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsagePolicyPage;
