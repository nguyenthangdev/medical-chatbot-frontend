import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    Bot,
    CheckCircle2,
    Clock3,
    MessageCircle,
    ShieldCheck,
    Stethoscope,
    Users
} from "lucide-react";

export default function Dashboard() {
    const stats = [
        {
            title: "Người dùng",
            value: "1,245",
            change: "+12.4%",
            helper: "Tăng trong 30 ngày",
            icon: Users,
            tone: "sky"
        },
        {
            title: "Bác sĩ trực tuyến",
            value: "42",
            change: "+8",
            helper: "Sẵn sàng hỗ trợ",
            icon: Stethoscope,
            tone: "emerald"
        },
        {
            title: "Hội thoại hôm nay",
            value: "8,401",
            change: "+18.2%",
            helper: "Từ trợ lý AI",
            icon: MessageCircle,
            tone: "blue"
        },
        {
            title: "Cảnh báo y tế",
            value: "3",
            change: "Cần xem",
            helper: "Ưu tiên cao",
            icon: AlertTriangle,
            tone: "rose"
        }
    ];

    const activityItems = [
        { title: "AI phân loại ban đầu 128 hội thoại mới", time: "5 phút trước", status: "success" },
        { title: "Có 3 cảnh báo cần đội ngũ y tế kiểm tra", time: "18 phút trước", status: "warning" },
        { title: "Cập nhật nhóm quyền Điều phối viên", time: "42 phút trước", status: "info" },
        { title: "Đồng bộ cấu hình hệ thống hoàn tất", time: "1 giờ trước", status: "success" }
    ];

    const queues = [
        { label: "AI đã xử lý", value: 72, color: "bg-sky-500" },
        { label: "Bác sĩ cần xem", value: 18, color: "bg-emerald-500" },
        { label: "Cảnh báo khẩn cấp", value: 10, color: "bg-rose-500" }
    ];

    const toneClasses = {
        sky: "bg-sky-50 text-sky-700 border-sky-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        rose: "bg-rose-50 text-rose-700 border-rose-200"
    };

    const statusClasses = {
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        info: "bg-sky-100 text-sky-700"
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-sm">
                <div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-8">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                            <Bot size={16} />
                            Vận hành AI y tế
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                            Tổng quan hệ thống
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                            Theo dõi hiệu suất tư vấn, cảnh báo y tế và trạng thái vận hành của nền tảng Medical Chatbot.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-emerald-700">Sức khỏe hệ thống</p>
                                <p className="mt-2 text-3xl font-semibold text-slate-950">99.98%</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                                <ShieldCheck size={24} />
                            </div>
                        </div>
                        <div className="mt-5 h-2 rounded-full bg-emerald-100">
                            <div className="h-2 w-[92%] rounded-full bg-emerald-500" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-emerald-700">
                            API, cơ sở dữ liệu và dịch vụ AI đang hoạt động ổn định.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <article
                            key={stat.title}
                            className="rounded-3xl border border-slate-300 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${toneClasses[stat.tone]}`}>
                                    <Icon size={22} />
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    {stat.change}
                                    {stat.tone !== "rose" && <ArrowUpRight size={13} />}
                                </span>
                            </div>
                            <p className="mt-5 text-sm font-semibold text-slate-500">{stat.title}</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</p>
                            <p className="mt-2 text-sm text-slate-400">{stat.helper}</p>
                        </article>
                    );
                })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-950">Hiệu suất hội thoại</h2>
                            <p className="mt-1 text-sm text-slate-500">Phân bổ trạng thái xử lý trong hôm nay</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                            <Clock3 size={16} />
                            Thời gian thực
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="flex aspect-square max-h-72 items-center justify-center rounded-full bg-[conic-gradient(#0ea5e9_0_72%,#10b981_72%_90%,#f43f5e_90%_100%)] p-6">
                            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                                <p className="text-sm font-semibold text-slate-500">Tỷ lệ xử lý</p>
                                <p className="mt-2 text-4xl font-semibold text-slate-950">92%</p>
                                <p className="mt-2 text-sm text-slate-400">AI + bác sĩ kiểm tra</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {queues.map((queue) => (
                                <div key={queue.label}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-semibold text-slate-700">{queue.label}</span>
                                        <span className="font-semibold text-slate-500">{queue.value}%</span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                        <div className={`h-full rounded-full ${queue.color}`} style={{ width: `${queue.value}%` }} />
                                    </div>
                                </div>
                            ))}
                            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                                <div className="flex items-start gap-3">
                                    <Activity size={20} className="mt-0.5 text-sky-700" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Quy trình tư vấn ổn định</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            Hàng đợi tư vấn đang trong ngưỡng bình thường, chưa cần mở rộng nhân sự trực.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-950">Hoạt động gần đây</h2>
                    <p className="mt-1 text-sm text-slate-500">Những sự kiện quan trọng trong hệ thống</p>

                    <div className="mt-6 space-y-4">
                        {activityItems.map((item) => (
                            <div key={item.title} className="flex gap-3">
                                <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${statusClasses[item.status]}`}>
                                    <CheckCircle2 size={16} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold leading-6 text-slate-800">{item.title}</p>
                                    <p className="text-xs font-medium text-slate-400">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
