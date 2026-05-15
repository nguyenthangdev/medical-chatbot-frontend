import { Outlet } from 'react-router-dom';
import { Bot, CheckCircle2, HeartPulse, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

const ClientAuthLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#f6fbff] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_rgba(15,92,150,0.12)] lg:min-h-[720px] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(16,185,129,0.22),transparent_24%)]" />

            <div className="relative">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/[0.14] px-4 py-2 text-sm font-semibold ring-1 ring-white/20 backdrop-blur">
                <HeartPulse size={18} />
                AI Medical Platform
              </div>

              <div className="mt-12 max-w-xl">
                <h1 className="text-5xl font-semibold leading-tight tracking-normal">Bác Sĩ Ảo</h1>
                <p className="mt-5 text-xl leading-8 text-sky-50">
                  Trợ lý sức khỏe thông minh giúp người dùng trò chuyện, theo dõi và tiếp cận tư vấn y tế ban đầu trong một trải nghiệm an toàn, rõ ràng.
                </p>
              </div>
            </div>

            <div className="relative space-y-5">
              <div className="rounded-3xl border border-white/[0.18] bg-white/12 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                      <Bot size={23} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Trợ lý sức khỏe AI</p>
                      <p className="text-xs text-sky-100">Đang phân tích triệu chứng</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/[0.18] px-3 py-1 text-xs font-semibold text-emerald-50 ring-1 ring-emerald-200/30">
                    Secure
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                    Tôi bị đau họng và hơi sốt từ tối qua.
                  </div>
                  <div className="max-w-[84%] rounded-2xl rounded-tl-sm bg-sky-950/[0.22] px-4 py-3 text-sm leading-6 text-white ring-1 ring-white/10">
                    Tôi sẽ hỏi thêm vài thông tin để hỗ trợ bạn tốt hơn. Bạn có ho hoặc khó thở không?
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="h-2.5 animate-pulse rounded-full bg-white/[0.55]" />
                    <div className="h-2.5 animate-pulse rounded-full bg-white/[0.35]" />
                    <div className="h-2.5 animate-pulse rounded-full bg-white/25" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: 'Bảo mật' },
                  { icon: Sparkles, label: 'AI hỗ trợ' },
                  { icon: LockKeyhole, label: 'Riêng tư' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-white/[0.16] bg-white/10 p-4 backdrop-blur">
                      <Icon size={19} className="mb-3 text-emerald-100" />
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <main className="flex items-center justify-center bg-white px-5 py-8 sm:px-8 lg:px-12">
            <div className="w-full max-w-[460px]">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                  <HeartPulse size={25} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-950">Bác Sĩ Ảo</p>
                  <p className="text-sm text-slate-500">AI Medical Platform</p>
                </div>
              </div>

              <div className="mb-6 hidden items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 sm:flex">
                <CheckCircle2 size={18} />
                Kết nối bảo mật cho tài khoản chăm sóc sức khỏe của bạn
              </div>

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClientAuthLayout;
