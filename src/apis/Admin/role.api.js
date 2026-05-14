import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const getRolesAPI = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.keyword) queryParams.set('keyword', params.keyword);

  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/roles?${queryParams.toString()}`);
  return response.data;
};

export const getRoleDetailAPI = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/roles/${id}`);
  return response.data;
};

export const createRoleAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/admin/v1/roles`, data);
  return response.data;
};

export const updateRoleAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/admin/v1/roles/${id}`, data);
  return response.data;
};

export const deleteRoleAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/v1/roles/${id}`);
  return response.data;
};

export const updatePermissionsAPI = async (permissionsData) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/api/admin/v1/roles/permissions`, { permissions: permissionsData });
  return response.data;
};