import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';

import { API_ROOT } from '../../utils/constants';

// Lấy danh sách messages của 1 conversation
export const getMessagesByConversation = async (conversationId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/messages/conversation/${conversationId}`)
  return response.data
}

// Tạo tin nhắn mới
export const createMessage = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/admin/v1/messages`, data)
  return response.data
}

// Xóa tin nhắn
export const deleteMessage = async (messageId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/v1/messages/${messageId}`)
  return response.data
}
