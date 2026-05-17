import axios from 'axios';
import { API_ROOT } from '../../utils/constants';

export const registerClientAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/api/v1/register`, data, { withCredentials: true });
  return response.data;
};

export const verifyEmailAPI = async (token) => {
  const response = await axios.get(`${API_ROOT}/api/v1/verify-email`, {
    params: { token },
    withCredentials: true
  });
  return response.data;
};

export const loginClientAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/api/v1/login`, data, { withCredentials: true });
  return response.data;
};

export const forgotPasswordAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/api/v1/forgot-password`, data, { withCredentials: true });
  return response.data;
};

export const resetPasswordAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/api/v1/reset-password`, data, { withCredentials: true });
  return response.data;
};

export const refreshTokenAPI = async () => {
  const response = await axios.post(`${API_ROOT}/api/v1/refresh-token`, {}, { withCredentials: true });
  return response.data;
};

export const fetchLogoutAPI = async () => {
  const response = await axios.delete(`${API_ROOT}/api/v1/logout`, { withCredentials: true });
  return response.data;
};
