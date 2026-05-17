import authorizedAxiosInstance from '../../utils/authorizedAxiosClient';
import { API_ROOT } from '../../utils/constants';

export const uploadClientImageAPI = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/v1/upload/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};
