import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';

import { API_ROOT } from '../../utils/constants';

// // Lấy danh sách messages của 1 conversation
// export const getMessagesByConversation = async (conversationId) => {
//   const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/messages/conversation/${conversationId}`)
//   return response.data
// }

// Tạo tin nhắn mới
export const createMessage = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/admin/v1/messages`, data)
  return response.data
}

export const getAllMessagesAPI = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.keyword) queryParams.set('keyword', params.keyword);
  if (params.conversationId) queryParams.set('conversationId', params.conversationId);

  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/messages?${queryParams.toString()}`);
  return response.data;
};

export const getMessageDetailAPI = async (messageId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/messages/${messageId}`);
  return response.data;
};

export const deleteMessageAPI = async (messageId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/v1/messages/${messageId}`);
  return response.data;
};