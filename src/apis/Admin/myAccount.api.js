// src/apis/admin/myAccount.api.js
import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const fetchMyAccountAPI = async () => {
  // Dùng authorizedAxiosInstance để nó tự động gửi kèm Cookie
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/my-account`);
  return response.data;
};

// THÊM HÀM NÀY ĐỂ UPDATE
export const updateMyAccountAPI = async (data) => {
  // Method PATCH thường dùng để update một phần dữ liệu
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/my-account`, data);
  return response.data;
};