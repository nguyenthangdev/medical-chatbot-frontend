import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';
import { API_ROOT } from '../../utils/constants';

export const getConversationsAPI = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.keyword) queryParams.set('keyword', params.keyword);

  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/conversations?${queryParams.toString()}`);
  return response.data;
}

export const getConversationDetailAPI = async (conversationId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/conversations/${conversationId}`);
  return response.data;
}

export const deleteConversationAPI = async (conversationId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/v1/conversations/${conversationId}`);
  return response.data;
}

export const toggleConversationStatusAPI = async (conversationId) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/admin/v1/conversations/${conversationId}/toggle`);
  return response.data;
}