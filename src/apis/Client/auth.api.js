// src/apis/client/auth.api.js
import axios from 'axios';
import { API_ROOT } from '../../utils/constants';

export const registerClientAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/register`, data, { withCredentials: true });
  return response.data;
};

export const loginClientAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/login`, data, {
    withCredentials: true 
  });
  return response.data;
};

export const refreshTokenAPI = async () => {
  const response = await axios.post(`${API_ROOT}/refresh-token`, { withCredentials: true });
  return response.data;
};

export const fetchLogoutAPI = async () => {
  const response = await axios.delete(`${API_ROOT}/logout`, { withCredentials: true });
  return response.data;
};