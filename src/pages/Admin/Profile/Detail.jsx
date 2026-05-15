import { Link } from "react-router-dom";
import {
    CalendarDays,
    Mail,
    Pencil,
    ShieldCheck,
    UserRound,
    UserX
} from "lucide-react";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext.jsx";

export default function ProfileDetail() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="max-w-5xl rounded-3xl border border-slate-300 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="space-y-4">
                    <div className="h-8 w-56 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <UserX size={26} />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">Không thể tải thông tin tài khoản</p>
                <p className="mt-2 text-sm text-slate-500">Vui lòng thử lại sau hoặc đăng nhập lại.</p>
            </div>
        );
    }

    const avatarLetter = (user.fullName || user.name || "A").charAt(0).toUpperCase();

    return (
        <div className="max-w-5xl space-y-5">
            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                            <UserRound size={16} />
                            Hồ sơ quản trị viên
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                            Thông tin cá nhân
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Quản lý thông tin định danh dùng trong bảng điều khiển quản trị Medical Chatbot.
                        </p>
                    </div>

                    <Link
                        to="/admin/my-profile/edit"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                    >
                        <Pencil size={17} />
                        Chỉnh sửa
                    </Link>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
                <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-sky-100 text-4xl font-semibold text-sky-700 ring-4 ring-sky-50">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Ảnh đại diện" className="h-full w-full object-cover" />
                        ) : (
                            avatarLetter
                        )}
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-2xl font-semibold text-slate-950">
                            {user.fullName || user.name || "Quản trị viên"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                                {user.role_id?.title || "Chưa phân quyền"}
                            </span>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                                user.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                    : 'bg-rose-50 text-rose-700 ring-rose-200'
                            }`}>
                                {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard icon={UserRound} label="Họ và tên" value={user.fullName || user.name || "Chưa cập nhật"} />
                    <InfoCard icon={Mail} label="Email" value={user.email || "Chưa cập nhật"} />
                    <InfoCard icon={ShieldCheck} label="Vai trò" value={user.role_id?.title || "Chưa phân quyền"} />
                    <InfoCard
                        icon={CalendarDays}
                        label="Ngày tham gia"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "Chưa có dữ liệu"}
                    />
                </div>
            </section>
        </div>
    );
}

function InfoCard({ icon, label, value }) {
    const IconComponent = icon;

    return (
        <div className="rounded-2xl border border-slate-300 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                    <IconComponent size={18} />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 break-words text-base font-semibold text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
