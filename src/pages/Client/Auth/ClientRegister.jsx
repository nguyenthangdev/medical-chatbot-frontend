import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { registerClientAPI } from '../../../apis/Client/auth.api';

const ClientRegister = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    try {
      await registerClientAPI(data);
      setIsSuccess(true);
      toast.success('🎉 Tạo tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const inputClass = (hasError) =>
    `w-full bg-gray-50 border-2 rounded-2xl py-3 px-5 text-xl text-gray-800 outline-none focus:bg-white transition-colors ${
      hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
    }`;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Tạo Tài Khoản Mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Họ và tên */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 pl-2">Họ và tên</label>
          <input
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            className={inputClass(errors.fullName)}
            {...register('fullName', {
              required: 'Vui lòng nhập Họ và Tên.',
              minLength: { value: 2, message: 'Họ và tên phải có ít nhất 2 ký tự.' },
            })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1 pl-2">⚠️ {errors.fullName.message}</p>
          )}
        </div>

        {/* Số điện thoại hoặc Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 pl-2">Số điện thoại hoặc Email</label>
          <input
            type="text"
            placeholder="0909... hoặc example@email.com"
            className={inputClass(errors.identifier)}
            {...register('identifier', {
              required: 'Vui lòng nhập Số điện thoại hoặc Email.',
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
          <label className="block text-gray-700 font-medium mb-1 pl-2">Mật khẩu</label>
          <input
            type="password"
            placeholder="Tạo mật khẩu dễ nhớ..."
            className={inputClass(errors.password)}
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu.',
              minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 pl-2">⚠️ {errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className={`w-full text-white font-bold text-xl py-4 rounded-2xl shadow-md transition-all mt-4 ${
            isSubmitting || isSuccess ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Đang xử lý...' : isSuccess ? 'Thành công!' : 'Đăng Ký Tài Khoản'}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-600 text-lg">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ClientRegister;