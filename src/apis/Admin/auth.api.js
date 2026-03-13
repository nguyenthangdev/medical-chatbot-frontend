// src/apis/admin/auth.api.js
import axios from 'axios';
import { API_ROOT } from '../../utils/constants';

// Import instance axios đã được cấu hình interceptor (để dùng cho các API cần gửi token)
import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin'; 

/**
 * 1. API ĐĂNG KÝ
 * Dùng axios thường vì lúc này chưa có token/cookie
 */
export const registerAdminAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/api/v1/auth/register`, data);
  return response.data;
};

/**
 * 2. API ĐĂNG NHẬP
 * Dùng axios thường nhưng BẮT BUỘC thêm `{ withCredentials: true }` 
 * để trình duyệt chấp nhận và tự động lưu 2 cookie (accessToken, refreshToken) từ Server trả về.
 */
export const loginAdminAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/api/v1/auth/login`, data, {
    withCredentials: true 
  });
  return response.data;
};

/**
 * 3. API LÀM MỚI TOKEN (Refresh Token)
 * Dùng authorizedAxiosInstance để nó tự động đính kèm cookie refreshToken gửi lên BE.
 */
export const refreshTokenAPI = async () => {
  const response = await axios.post(`${API_ROOT}/admin/auth/refresh-token`);
  return response.data;
};

/**
 * 4. API ĐĂNG XUẤT
 * Gọi method DELETE theo đúng định nghĩa ở Backend để xóa cookie.
 */
export const fetchLogoutAPI = async () => {
  const response = await axios.delete(`${API_ROOT}/admin/auth/logout`);
  return response.data;
};