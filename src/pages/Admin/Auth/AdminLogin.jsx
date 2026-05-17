import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Stethoscope
} from "lucide-react";
import { toast } from "react-toastify";
import { loginAdminAPI } from "../../../apis/Admin/auth.api";
import { useAuth } from "../../../contexts/Admin/AdminAuthContext";
import { formatLoginLockRemaining, getLoginLockRemainingSeconds } from "../../../utils/authLock";

export default function AdminLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lockedUntil, setLockedUntil] = useState(null);
    const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);

    useEffect(() => {
        if (!lockedUntil) return undefined;

        const updateRemaining = () => {
            const remaining = getLoginLockRemainingSeconds(lockedUntil);
            setLockRemainingSeconds(remaining);
            if (remaining <= 0) setLockedUntil(null);
        };

        const timer = setInterval(updateRemaining, 1000);

        return () => clearInterval(timer);
    }, [lockedUntil]);

    const onSubmit = async (data) => {
        if (lockRemainingSeconds > 0) {
            toast.error(`Tài khoản đang bị tạm khóa. Vui lòng thử lại sau ${formatLoginLockRemaining(lockRemainingSeconds)}.`);
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginAdminAPI({
                email: data.email,
                password: data.password
            });
            
            if (response.accountAdmin || response.data) {
                toast.success("🎉 Đăng nhập thành công!");
                await refreshUser(); 
                
                setTimeout(() => {
                    navigate("/admin/dashboard", { replace: true });
                }, 1500);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi kết nối đến server!";
            if (error.response?.data?.lockedUntil) {
                setLockedUntil(error.response.data.lockedUntil);
                setLockRemainingSeconds(getLoginLockRemainingSeconds(error.response.data.lockedUntil));
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full overflow-hidden bg-[#f5f9fc] text-slate-900">
            <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_30%)]" />
                <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(90deg,rgba(226,239,248,0.68)_1px,transparent_1px),linear-gradient(180deg,rgba(226,239,248,0.68)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />

                <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur xl:grid-cols-[1.08fr_0.92fr]">
                    <div className="hidden min-h-[680px] flex-col justify-between bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-10 xl:flex">
                        <div>
                            <div className="inline-flex items-center gap-3 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                                    <Stethoscope size={17} />
                                </span>
                                Quản trị AI y tế
                            </div>

                            <div className="mt-16 max-w-xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                                    Medical Chatbot
                                </p>
                                <h1 className="mt-4 text-5xl font-semibold leading-tight text-slate-950">
                                    Trung tâm quản trị cho nền tảng tư vấn y tế thông minh
                                </h1>
                                <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                                    Theo dõi người dùng, hội thoại và cấu hình hệ thống trong một giao diện sạch, bảo mật và dễ vận hành.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="rounded-2xl border border-sky-200 bg-white/78 p-4 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                    <BrainCircuit size={20} />
                                </div>
                                <p className="mt-5 text-2xl font-semibold text-slate-950">AI</p>
                                <p className="mt-1 text-sm leading-6 text-slate-500">Quy trình trợ lý AI</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-200 bg-white/78 p-4 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <Activity size={20} />
                                </div>
                                <p className="mt-5 text-2xl font-semibold text-slate-950">24/7</p>
                                <p className="mt-1 text-sm leading-6 text-slate-500">Sẵn sàng giám sát</p>
                            </div>
                            <div className="rounded-2xl border border-blue-100 bg-white/78 p-4 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                    <ShieldCheck size={20} />
                                </div>
                                <p className="mt-5 text-2xl font-semibold text-slate-950">Bảo mật</p>
                                <p className="mt-1 text-sm leading-6 text-slate-500">Truy cập quản trị</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-[680px] items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
                        <div className="w-full max-w-md">
                            <div className="mb-8 flex items-center justify-between gap-4 xl:hidden">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                        <Stethoscope size={22} />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-slate-950">Medical Chatbot</p>
                                        <p className="text-sm text-slate-500">Bảng quản trị</p>
                                    </div>
                                </div>
                                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                    Bảo mật
                                </div>
                            </div>

                            <div>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                    Chỉ dành cho nhân sự được cấp quyền
                                </div>
                                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                                    Đăng nhập quản trị
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Truy cập bảng điều khiển để quản lý dữ liệu hội thoại, người dùng và cấu hình nền tảng.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                                {lockRemainingSeconds > 0 && (
                                    <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                                        Tài khoản đang bị tạm khóa. Thử lại sau {formatLoginLockRemaining(lockRemainingSeconds)}.
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email quản trị
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                                        <input
                                            id="admin-email"
                                            type="email"
                                            placeholder="admin@medicalchatbot.com"
                                            aria-invalid={Boolean(errors.email)}
                                            {...register("email", {
                                                required: "Vui lòng nhập email",
                                                pattern: {
                                                    value: /^\S+@\S+$/i,
                                                    message: "Email không hợp lệ"
                                                }
                                            })}
                                            className={`h-13 w-full rounded-2xl border bg-white px-12 py-3 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200 ${
                                                errors.email ? "border-rose-300 bg-rose-50/40" : "border-slate-300 hover:border-slate-300"
                                            }`}
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-2 text-sm font-medium text-rose-600">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                                        <input
                                            id="admin-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nhập mật khẩu"
                                            aria-invalid={Boolean(errors.password)}
                                            {...register("password", {
                                                required: "Vui lòng nhập mật khẩu"
                                            })}
                                            className={`h-13 w-full rounded-2xl border bg-white px-12 py-3 pr-14 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200 ${
                                                errors.password ? "border-rose-300 bg-rose-50/40" : "border-slate-300 hover:border-slate-300"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-200"
                                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="mt-2 text-sm font-medium text-rose-600">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || lockRemainingSeconds > 0}
                                    className={`group flex h-13 w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold text-white shadow-[0_14px_28px_rgba(2,132,199,0.24)] transition ${
                                        isLoading || lockRemainingSeconds > 0
                                            ? "cursor-not-allowed bg-sky-400"
                                            : "bg-sky-600 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-[0_18px_34px_rgba(2,132,199,0.28)] active:translate-y-0"
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Đang xác thực...
                                        </>
                                    ) : (
                                        <>
                                            Đăng nhập
                                            <ArrowRight size={19} className="transition group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </button>

                                {isLoading && (
                                    <div className="space-y-2 rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                                        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-sky-200" />
                                        <div className="h-2.5 w-5/6 animate-pulse rounded-full bg-sky-100" />
                                    </div>
                                )}
                            </form>

                            <div className="mt-8 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-center">
                                <p className="text-sm font-medium text-slate-700">
                                    Chưa có tài khoản quản trị?
                                </p>
                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Vui lòng liên hệ Quản trị viên để được cấp quyền truy cập.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
