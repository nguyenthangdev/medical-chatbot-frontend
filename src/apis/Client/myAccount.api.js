import authorizedAxiosInstance from '../../utils/authorizedAxiosClient';
import { API_ROOT } from '../../utils/constants';

export const getMyAccountAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/my-profile`);
  return response.data;
};

export const updateMyAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/my-profile`, data);
  return response.data;
};