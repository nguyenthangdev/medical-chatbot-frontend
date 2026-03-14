import axios from 'axios';
import { API_ROOT } from '../../utils/constants';

export const registerAdminAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/auth/register`, data, 
    { withCredentials: true }
  );
  return response.data;
};

export const loginAdminAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/auth/login`, data, {
    withCredentials: true 
  });
  return response.data;
};

export const refreshTokenAPI = async () => {
  const response = await axios.post(`${API_ROOT}/auth/refresh-token`, 
    { withCredentials: true }
  );
  return response.data;
};

export const fetchLogoutAPI = async () => {
  const response = await axios.delete(`${API_ROOT}/auth/logout`, 
    { withCredentials: true }
  );
  return response.data;
};