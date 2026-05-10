import authorizedAxiosInstance from '../../utils/authorizedAxiosClient';
import { API_ROOT } from '../../utils/constants';

export const getMyProfileAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/my-profile`);
  return response.data;
};

export const updateMyProfileAPI = async (data) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/api/v1/my-profile`, data);
  return response.data;
};
