import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { forgotPasswordAPI } from '../../../apis/Client/auth.api';
import { forgotPasswordSchema } from '../../../validations/Client/auth.validation';

const ClientForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onTouched', resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await forgotPasswordAPI(data);
      setIsSuccess(true);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu!');
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
          Khôi phục bảo mật
        </div>
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          Quên mật khẩu
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          Nhập email tài khoản, hệ thống sẽ gửi link đặt lại mật khẩu có thời hạn.
        </p>
      </div>

      {isSuccess && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          Vui lòng kiểm tra hộp thư và làm theo hướng dẫn trong email.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(37,99,235,0.22)] transition-all ${
            isSubmitting
              ? 'cursor-not-allowed bg-slate-300 shadow-none'
              : 'bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_18px_42px_rgba(37,99,235,0.28)]'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang gửi email
            </>
          ) : (
            <>
              Gửi link đặt lại
              <ArrowRight size={19} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-center text-base text-slate-600">
        Nhớ mật khẩu?{' '}
        <Link to="/login" className="font-bold text-blue-600 transition-colors hover:text-blue-700">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ClientForgotPassword;
