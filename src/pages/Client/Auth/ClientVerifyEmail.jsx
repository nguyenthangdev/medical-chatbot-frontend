import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { verifyEmailAPI } from '../../../apis/Client/auth.api';

const ClientVerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const invalidLinkMessage = 'Link xác nhận không hợp lệ hoặc đã hết hạn!';
  const toastKeyRef = useRef(null);
  const [state, setState] = useState(() => (
    token
      ? { loading: true, success: false, message: '' }
      : { loading: false, success: false, message: invalidLinkMessage }
  ));

  useEffect(() => {
    if (!token) {
      if (toastKeyRef.current !== 'missing-token') {
        toast.error(invalidLinkMessage);
        toastKeyRef.current = 'missing-token';
      }
      return;
    }

    let isMounted = true;

    verifyEmailAPI(token)
      .then((res) => {
        if (!isMounted) return;
        setState({ loading: false, success: true, message: res.message });
        if (toastKeyRef.current !== token) {
          toast.success(res.message);
          toastKeyRef.current = token;
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const message = err.response?.data?.message || invalidLinkMessage;
        setState({ loading: false, success: false, message });
        if (toastKeyRef.current !== token) {
          toast.error(message);
          toastKeyRef.current = token;
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, invalidLinkMessage]);

  const Icon = state.success ? CheckCircle2 : AlertCircle;

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
          <ShieldCheck size={16} />
          Xác nhận email
        </div>
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          Kích hoạt tài khoản
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-500">
          Hệ thống đang kiểm tra link xác nhận đăng ký của bạn.
        </p>
      </div>

      <div
        className={`rounded-2xl border px-4 py-4 text-sm font-semibold ${
          state.loading
            ? 'border-sky-100 bg-sky-50 text-sky-700'
            : state.success
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-rose-100 bg-rose-50 text-rose-700'
        }`}
      >
        <div className="flex items-start gap-3">
          {state.loading ? <Loader2 size={20} className="mt-0.5 animate-spin" /> : <Icon size={20} className="mt-0.5" />}
          <span>{state.loading ? 'Đang xác nhận email...' : state.message}</span>
        </div>
      </div>

      {!state.loading && (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-center text-base text-slate-600">
          {state.success ? 'Tài khoản đã sẵn sàng. ' : 'Bạn có thể quay lại trang đăng nhập. '}
          <Link to="/login" className="font-bold text-blue-600 transition-colors hover:text-blue-700">
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientVerifyEmail;
