import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const getUsersAPI = async (queryString = "") => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/users${queryString}`);
  return response.data;
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