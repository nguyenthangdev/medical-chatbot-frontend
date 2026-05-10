import authorizedAxiosInstance from '../../utils/authorizedAxiosClient';
import { API_ROOT } from '../../utils/constants';

export const createConversation = async (userId, model = 'qwen-7b') => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/conversation`, { userId, model });
  return response.data;
}

export const sendMessages = async (conversationId, message, model = 'qwen-7b') => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/message`, { conversationId, message, model });
  return response.data;
}

export const getConversations = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/chat/conversations/${userId}`);
  return response.data;
}

export const getMessages = async (conversationId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/v1/chat/messages/${conversationId}`);
  return response.data;
}

export const deleteConversation = async (conversationId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/v1/chat/conversation/${conversationId}`);
  return response.data;
}

export const speechToText = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/stt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

