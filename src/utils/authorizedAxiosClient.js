// src/utils/authorizedAxiosClient.js
import axios from 'axios';
import { fetchLogoutAPI, refreshTokenAPI } from '../apis/Client/auth.api'; // Nhớ import đúng đường dẫn
import { toast } from 'react-toastify';

const authorizedAxiosInstance = axios.create();

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10; 
authorizedAxiosInstance.defaults.withCredentials = true;

authorizedAxiosInstance.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

let refreshTokenPromise = null;

authorizedAxiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  // 401: Token sai hoặc không có
  if (error.response?.status === 401) {
    await fetchLogoutAPI().catch(() => {}); 

    // Bắn event báo cho App biết để đá văng ra /login
    const event = new CustomEvent('client-force-logout');
    window.dispatchEvent(event);
    return Promise.reject(error);
  }

  const originalRequest = error.config;

  // 410: Token hết hạn, cần làm mới
  if (error.response?.status === 410 && originalRequest) {
    if (originalRequest._retry) {
      await fetchLogoutAPI().catch(() => {}); 
      const event = new CustomEvent('client-force-logout');
      window.dispatchEvent(event);
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then((res) => { return res; })
        .catch(async (_error) => {
          await fetchLogoutAPI().catch(() => {});
          const event = new CustomEvent('client-force-logout');
          window.dispatchEvent(event);
          return Promise.reject(_error);
        })
        .finally(() => {
          refreshTokenPromise = null;
        });
    }

    return refreshTokenPromise.then(() => {
      return authorizedAxiosInstance(originalRequest);
    });
  }

  // Báo lỗi bằng Toast
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message);
  }

  return Promise.reject(error);
});

export default authorizedAxiosInstance;