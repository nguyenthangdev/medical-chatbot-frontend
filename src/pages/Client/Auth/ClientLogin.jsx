import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { loginClientAPI } from '../../../apis/Client/auth.api';
import { useAuth } from '../../../contexts/Client/ClientAuthContext';
import { loginSchema } from '../../../validations/Client/auth.validation';
import { formatLoginLockRemaining, getLoginLockRemainingSeconds } from '../../../utils/authLock';

const ClientLogin = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', resolver: zodResolver(loginSchema) });

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

    try {
      const res = await loginClientAPI(data);
      if (res.code === 200) {
        toast.success(res.message);
        await refreshUser();
        setTimeout(() => navigate('/', { replace: true }), 1500);
      } else {
        toast.error(res.message || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      const lockedUntilValue = err.response?.data?.lockedUntil;
      if (lockedUntilValue) {
        setLockedUntil(lockedUntilValue);
        setLockRemainingSeconds(getLoginLockRemainingSeconds(lockedUntilValue));
      }
      toast.error(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-2xl border bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:-translate-y-0.5 focus:shadow-[0_14px_30px_rgba(14,116,144,0.10)] ${
      hasError
        ? 'border-rose-300 ring-4 ring-rose-50 focus:border-rose-400'
        : 'border-slate-200 hover:border-sky-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-50'
    }`;

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
          <ShieldCheck size={16} />
          Đăng nhập bảo mật
        </div>
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          Chào mừng trở lại
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          Tiếp tục cuộc trò chuyện với trợ lý y tế AI và quản lý thông tin sức khỏe của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {lockRemainingSeconds > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            Tài khoản đang bị tạm khóa. Thử lại sau {formatLoginLockRemaining(lockRemainingSeconds)}.
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="example@email.com"
              className={inputClass(errors.email)}
              autoComplete="email"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
              <AlertCircle size={16} />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu của bạn"
              className={`${inputClass(errors.password)} pr-12`}
              autoComplete="current-password"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
              <AlertCircle size={16} />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-700">
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || lockRemainingSeconds > 0}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(37,99,235,0.22)] transition-all ${
            isSubmitting || lockRemainingSeconds > 0
              ? 'cursor-not-allowed bg-slate-300 shadow-none'
              : 'bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_18px_42px_rgba(37,99,235,0.28)]'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang xác thực
            </>
          ) : (
            <>
              Vào khám ngay
              <ArrowRight size={19} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-center text-base text-slate-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-bold text-blue-600 transition-colors hover:text-blue-700">
          Đăng ký mới
        </Link>
      </div>
    </div>
  );
};

export default ClientLogin;
