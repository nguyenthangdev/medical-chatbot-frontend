import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { loginClientAPI } from '../../../apis/Client/auth.api';
import { useAuth } from '../../../contexts/Client/ClientAuthContext';

const ClientLogin = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
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
      toast.error(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const inputClass = (hasError) =>
    `w-full bg-gray-50 border-2 rounded-2xl py-4 px-5 text-xl text-gray-800 outline-none focus:bg-white transition-colors placeholder-gray-400 ${
      hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
    }`;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Đăng Nhập</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Tài khoản */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 pl-2">Tài khoản (Email / SĐT)</label>
          <input
            type="text"
            placeholder="Nhập email hoặc số điện thoại..."
            className={inputClass(errors.identifier)}
            {...register('identifier', {
              required: 'Bác/cháu vui lòng nhập Email hoặc Số điện thoại ạ.',
              validate: (value) => {
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                const isPhone = /^(0|\+84)[0-9]{9}$/.test(value);
                return isEmail || isPhone || 'Vui lòng nhập đúng định dạng Email hoặc Số điện thoại.';
              },
            })}
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1 pl-2">⚠️ {errors.identifier.message}</p>
          )}
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 pl-2">Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            className={inputClass(errors.password)}
            {...register('password', {
              required: 'Bác/cháu chưa nhập mật khẩu.',
              minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 pl-2">⚠️ {errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white font-bold text-xl py-4 rounded-2xl shadow-md transition-all mt-4 ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Vào Khám Ngay'}
        </button>
      </form>

      <div className="mt-8 text-center text-gray-600 text-lg">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Đăng ký mới
        </Link>
      </div>
    </div>
  );
};

export default ClientLogin;