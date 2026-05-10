import authorizedAxiosInstance from '../../utils/authorizedAxiosAdmin';

import { API_ROOT } from '../../utils/constants';

// Lấy danh sách conversations
export const getConversations = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/conversations`)
  return response.data
}

// Lấy chi tiết 1 conversation
export const getConversationDetail = async (conversationId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/admin/v1/conversations/${conversationId}`)
  return response.data
}

// Cập nhật conversation (tiêu đề)
export const updateConversation = async (conversationId, data) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/api/admin/v1/conversations/${conversationId}`, data)
  return response.data
}

// Xóa conversation
export const deleteConversation = async (conversationId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/admin/v1/conversations/${conversationId}`)
  return response.data
}
