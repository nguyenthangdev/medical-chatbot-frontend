import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const getSettingsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/settings`);
  return response.data;
};

export const updateSettingAPI = async (modelName, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/admin/v1/settings/${modelName}`, data);
  return response.data;
};