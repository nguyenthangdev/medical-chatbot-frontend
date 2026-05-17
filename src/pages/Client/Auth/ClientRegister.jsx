import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { registerClientAPI } from '../../../apis/Client/auth.api';
import PasswordStrength from '../../../components/Client/PasswordStrength';
import { registerSchema } from '../../../validations/Client/auth.validation';

const ClientRegister = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched', resolver: zodResolver(registerSchema) });

  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;

    try {
      await registerClientAPI(payload);
      setIsSuccess(true);
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
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
          Hồ sơ sức khỏe cá nhân
        </div>
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          Tạo tài khoản mới
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          Bắt đầu sử dụng trợ lý y tế AI với một tài khoản đơn giản, bảo mật và dễ quản lý.
        </p>
      </div>

      {isSuccess && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          Tài khoản đã được tạo. Vui lòng mở email và bấm link xác nhận trước khi đăng nhập.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Họ và tên</label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className={inputClass(errors.fullName)}
              autoComplete="name"
              {...register('fullName', {
                required: 'Vui lòng nhập Họ và Tên.',
                minLength: { value: 2, message: 'Họ và tên phải có ít nhất 2 ký tự.' },
              })}
            />
          </div>
          {errors.fullName && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
              <AlertCircle size={16} />
              {errors.fullName.message}
            </p>
          )}
        </div>

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
              placeholder="Tạo mật khẩu mạnh"
              className={`${inputClass(errors.password)} pr-12`}
              autoComplete="new-password"
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
          <PasswordStrength password={passwordValue} error={errors.password} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Xác nhận mật khẩu</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              className={inputClass(errors.confirmPassword)}
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
              <AlertCircle size={16} />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(37,99,235,0.22)] transition-all ${
            isSubmitting || isSuccess
              ? 'cursor-not-allowed bg-slate-300 shadow-none'
              : 'bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_18px_42px_rgba(37,99,235,0.28)]'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang tạo tài khoản
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 size={20} />
              Thành công
            </>
          ) : (
            <>
              Đăng ký tài khoản
              <ArrowRight size={19} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-center text-base text-slate-600">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-bold text-blue-600 transition-colors hover:text-blue-700">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ClientRegister;
