import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const getUsersAPI = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.keyword) queryParams.set('keyword', params.keyword);

  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/users?${queryParams.toString()}`);
  return response.data; // Cấu trúc trả về sẽ là: { code, users, keyword, pagination }
};

export const getUserByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/users/${id}`);
  return response.data;
};

export const deleteUserAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/v1/users/${id}`);
  return response.data;
};

export const updateUserAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/api/admin/v1/users/${id}`, data);
  return response.data;
};