import { ArrowLeft, Check, Crown, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Miễn phí',
    subtitle: 'Phù hợp để bắt đầu sử dụng Bác sĩ Ảo',
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
    subtitle: 'Dành cho người hỏi đáp sức khỏe thường xuyên',
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
    subtitle: 'Dành cho người cần hạn mức sử dụng cao nhất',
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
    <div className="min-h-full overflow-y-auto bg-[#f5f9fc] text-slate-900">
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-5 py-8 md:px-8 md:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-2xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-sky-50 hover:text-blue-700"
          aria-label="Quay lại"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <section className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,92,150,0.10)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                <Stethoscope size={16} />
                Gói dịch vụ Bác sĩ Ảo
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
                Nâng cấp trải nghiệm hỏi đáp sức khỏe khi bạn cần nhiều hơn.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                Chọn gói phù hợp để có hạn mức cao hơn, phản hồi ổn định hơn và các tính năng AI hỗ trợ quản lý hội thoại sức khỏe tốt hơn.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5">
              <p className="text-sm font-semibold text-blue-700">Lưu ý y tế</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Bác sĩ Ảo chỉ cung cấp thông tin tham khảo và không thay thế bác sĩ, cơ sở y tế hoặc dịch vụ cấp cứu.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative flex min-h-[520px] flex-col rounded-[26px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(15,92,150,0.14)] ${
                  plan.featured ? 'border-blue-300 ring-4 ring-blue-50' : 'border-sky-100'
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    Được đề xuất
                  </div>
                )}

                <div className="p-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    plan.featured ? 'bg-blue-600 text-white' : 'bg-sky-50 text-blue-600'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-slate-950">{plan.name}</h2>
                  <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500">{plan.subtitle}</p>

                  <div className="mt-7 flex items-end gap-2">
                    <span className="text-4xl font-semibold text-slate-950">{plan.price}</span>
                    {plan.period && <span className="pb-1 text-sm font-medium text-slate-500">{plan.period}</span>}
                  </div>

                  <button
                    type="button"
                    className={`mt-7 w-full rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      plan.featured
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700'
                        : 'border border-sky-100 text-blue-700 hover:bg-sky-50'
                    }`}
                  >
                    {plan.button}
                  </button>
                </div>

                <div className="mt-auto border-t border-sky-100 p-6">
                  <p className="mb-4 text-sm font-bold text-slate-700">
                    {plan.featured ? 'Bao gồm mọi thứ trong gói Miễn phí:' : 'Tính năng nổi bật:'}
                  </p>
                  <ul className="space-y-3 text-sm leading-5 text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-slate-500">
          Giá và hạn mức hiện là nội dung hiển thị mẫu. Thanh toán, hóa đơn và quản lý gói sẽ được kết nối ở bước sau.
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;
