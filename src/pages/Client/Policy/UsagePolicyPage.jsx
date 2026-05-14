import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const items = [
  'MedBot chỉ cung cấp thông tin sức khỏe tham khảo, không thay thế bác sĩ hoặc cơ sở y tế.',
  'Không sử dụng MedBot để tự chẩn đoán, tự kê đơn, thay đổi liều thuốc hoặc trì hoãn việc đi khám.',
  'Với triệu chứng nguy hiểm như đau ngực, khó thở, ngất, co giật, chảy máu nhiều hoặc ý định tự làm hại bản thân, hãy gọi cấp cứu hoặc đến cơ sở y tế gần nhất.',
  'Không nhập thông tin cá nhân nhạy cảm của người khác nếu bạn không có quyền chia sẻ.',
  'Không dùng hệ thống để tạo nội dung gây hại, sai lệch y tế, lừa đảo hoặc vi phạm pháp luật.',
];

const UsagePolicyPage = () => {
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

        <h1 className="text-3xl font-bold">Chính sách sử dụng</h1>
        <p className={`mt-3 leading-7 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Những nguyên tắc dưới đây giúp MedBot được dùng đúng mục đích và an toàn trong các tình huống liên quan đến sức khỏe.
        </p>

        <div className={`mt-8 rounded-2xl border p-6 ${isDarkMode ? 'border-white/10 bg-[#2b2b29]' : 'border-gray-200 bg-white'}`}>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#da7756]" />
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
