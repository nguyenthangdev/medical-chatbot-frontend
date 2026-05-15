import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const getBIDashboardsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/bi/dashboards`);
  return response.data;
};

export const getBIGuestTokenAPI = async (dashboardKey) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/admin/v1/bi/guest-token/${dashboardKey}`);
  return response.data;
};
