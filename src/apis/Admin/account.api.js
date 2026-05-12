import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const getAccountsAPI = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.keyword) queryParams.set('keyword', params.keyword);

  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/accounts?${queryParams.toString()}`);
  return response.data;
};

export const createAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/admin/v1/accounts`, data);
  return response.data;
};

export const updateAccountAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/api/admin/v1/accounts/${id}`, data);
  return response.data;
};

export const deleteAccountAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/v1/accounts/${id}`);
  return response.data;
};

export const getAccountByIdAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/accounts/${id}`);
  return response.data;
};