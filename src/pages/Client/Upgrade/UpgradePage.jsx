import { ArrowLeft, Check, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Miễn phí',
    subtitle: 'Dùng thử Bác sĩ Ảo',
    price: '0đ',
    period: '',
    button: 'Tiếp tục dùng miễn phí',
    featured: false,
    icon: ShieldCheck,
    features: [
      'Chat sức khỏe cơ bản',
      'Lưu lịch sử hội thoại',
      'Nhận cảnh báo y tế quan trọng',
      'Tùy chỉnh kích thước chữ',
      'Giới hạn sử dụng theo ngày',
    ],
  },
  {
    name: 'Nâng cao',
    subtitle: 'Dành cho nhu cầu hỏi đáp thường xuyên',
    price: '89.000đ',
    period: '/ tháng',
    button: 'Chọn gói Nâng cao',
    featured: true,
    icon: Sparkles,
    features: [
      'Mọi tính năng của gói Miễn phí',
      'Hạn mức tin nhắn cao hơn',
      'Ưu tiên phản hồi khi hệ thống bận',
      'Tóm tắt hội thoại dài',
      'Truy cập sớm tính năng mới',
    ],
  },
  {
    name: 'Tối đa',
    subtitle: 'Dành cho người cần giới hạn cao nhất',
    price: '199.000đ',
    period: '/ tháng',
    button: 'Chọn gói Tối đa',
    featured: false,
    icon: Crown,
    features: [
      'Mọi tính năng của gói Nâng cao',
      'Hạn mức sử dụng cao nhất',
      'Ưu tiên xử lý ở giờ cao điểm',
      'Lưu trữ lịch sử lâu hơn',
      'Hỗ trợ nhiều mô hình AI hơn',
    ],
  },
];

const UpgradePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full overflow-y-auto bg-[#1f1f1f] text-white">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed left-6 top-6 z-10 rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Quay lại"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-5 py-16 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-normal md:text-4xl">
            Gói dịch vụ phát triển cùng bạn
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Chọn gói phù hợp để có hạn mức cao hơn và trải nghiệm Bác sĩ Ảo ổn định hơn. Đây là giao diện thử nghiệm, thanh toán sẽ được bổ sung sau.
          </p>

          <div className="mx-auto mt-7 inline-flex rounded-xl border border-white/10 bg-black/40 p-1 text-sm font-semibold">
            <button className="rounded-lg bg-white/15 px-6 py-2 text-white">Cá nhân</button>
            <button className="rounded-lg px-6 py-2 text-gray-400">Nhóm và doanh nghiệp</button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`flex min-h-[500px] flex-col rounded-2xl border bg-[#2b2b29] shadow-2xl ${
                  plan.featured ? 'border-[#da7756]' : 'border-white/10'
                }`}
              >
                <div className="p-6">
                  <Icon className={`h-12 w-12 ${plan.featured ? 'text-[#da7756]' : 'text-gray-200'}`} />
                  <h2 className="mt-5 text-2xl font-bold">{plan.name}</h2>
                  <p className="mt-1 text-sm text-gray-300">{plan.subtitle}</p>

                  <div className="mt-7 flex items-end gap-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="pb-1 text-sm text-gray-300">{plan.period}</span>}
                  </div>

                  <button
                    type="button"
                    className={`mt-7 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
                      plan.featured
                        ? 'bg-white text-gray-950 hover:bg-gray-100'
                        : 'border border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.button}
                  </button>
                </div>

                <div className="mt-1 border-t border-white/10 p-6">
                  <p className="mb-4 text-sm font-bold text-gray-200">
                    {plan.featured ? 'Bao gồm mọi thứ trong gói Miễn phí:' : 'Tính năng nổi bật:'}
                  </p>
                  <ul className="space-y-3 text-sm leading-5 text-gray-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-gray-500">
          Giá và hạn mức chỉ là nội dung hiển thị mẫu. Thông tin thanh toán, hóa đơn và quản lý gói sẽ được kết nối backend ở bước sau.
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;
