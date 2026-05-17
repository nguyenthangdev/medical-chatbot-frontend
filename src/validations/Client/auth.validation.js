import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(1, 'Mật khẩu không được để trống')
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
  .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số');

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống')
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Họ tên không được để trống')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .max(50, 'Họ tên không được quá 50 ký tự'),
    email: z
      .string()
      .trim()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  });

export const getPasswordStrength = (password = '') => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

export const strengthConfig = {
  0: { label: '', color: '#e5e7eb' },
  1: { label: 'Yếu', color: '#dc3545' },
  2: { label: 'Trung bình', color: '#f59e0b' },
  3: { label: 'Mạnh', color: '#16a34a' },
  4: { label: 'Rất mạnh', color: '#166534' }
};

export const getPasswordChecks = (password = '') => [
  { label: 'Ít nhất 8 ký tự', valid: password.length >= 8 },
  { label: 'Có ít nhất 1 chữ hoa', valid: /[A-Z]/.test(password) },
  { label: 'Có ít nhất 1 chữ số', valid: /[0-9]/.test(password) }
];
