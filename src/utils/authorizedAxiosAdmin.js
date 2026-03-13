import axios from 'axios';
// Nhớ import đúng đường dẫn tới các API của bạn
import { fetchLogoutAPI, refreshTokenAPI } from '../apis/Admin/auth.api';

import { toast } from 'react-toastify';

const authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request: 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10; 

// QUAN TRỌNG: Cho phép đính kèm cookie vào request gửi lên server
authorizedAxiosInstance.defaults.withCredentials = true; 

// Interceptor Can thiệp vào Request trước khi gửi đi
authorizedAxiosInstance.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Biến lưu trữ promise của việc gọi refresh token để tránh gọi nhiều lần cùng lúc
let refreshTokenPromise = null;

// Interceptor Can thiệp vào Response sau khi server trả về
authorizedAxiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  
  // 1. Nếu lỗi 401 (Unauthorized) - Thường là không có token hoặc token bị sai lệch
  if (error.response?.status === 401) {
    await fetchLogoutAPI().catch(() => {}); // Gọi API xóa cookie phía server

    // Bắn ra event force-logout để React bắt và điều hướng về trang Login
    const event = new CustomEvent('force-logout');
    window.dispatchEvent(event);

    return Promise.reject(error);
  }

  const originalRequest = error.config;

  // 2. Nếu lỗi 410 (Gone) - Token đã hết hạn, cần làm mới
  if (error.response?.status === 410 && originalRequest) {
    
    // Nếu request này đã được thử lại (retry) một lần rồi mà vẫn lỗi 410 -> Bắt đăng nhập lại
    if (originalRequest._retry) {
      await fetchLogoutAPI().catch(() => {});

      const event = new CustomEvent('force-logout');
      window.dispatchEvent(event);

      return Promise.reject(error);
    }

    // Đánh dấu request này đã được gọi lại
    originalRequest._retry = true;

    // Nếu chưa có tiến trình refresh token nào đang chạy thì mới gọi
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then((res) => {
          return res;
        })
        .catch(async (_error) => {
          // Nếu việc refresh token cũng thất bại -> Xóa cookie và bắt đăng nhập lại
          await fetchLogoutAPI().catch(() => {});

          const event = new CustomEvent('force-logout');
          window.dispatchEvent(event);
          return Promise.reject(_error);
        })
        .finally(() => {
          // Dọn dẹp promise sau khi hoàn thành (dù thành công hay thất bại)
          refreshTokenPromise = null;
        });
    }

    // Đợi refresh token hoàn thành rồi mới gọi lại request ban đầu bị lỗi
    return refreshTokenPromise.then(() => {
      // Lúc này cookie đã có accessToken mới, gọi lại request ban đầu sẽ thành công
      return authorizedAxiosInstance(originalRequest);
    });
  }

  // 3. Xử lý các lỗi khác không phải 410 (hiển thị thông báo Toast)
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message);
  }

  return Promise.reject(error);
});

export default authorizedAxiosInstance;