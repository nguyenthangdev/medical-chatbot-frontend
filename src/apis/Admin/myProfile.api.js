import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const fetchMyProfileAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/my-profile`);
  return response.data;
};

export const updateMyProfileAPI = async (data) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/api/admin/v1/my-profile`, data);
  return response.data;
};

export const changeMyPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/api/admin/v1/my-profile/change-password`, data);
  return response.data;
};
