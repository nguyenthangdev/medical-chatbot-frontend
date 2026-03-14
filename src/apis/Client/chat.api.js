// front-end/src/apis/chatApi.js
import authorizedAxiosInstance from '../../utils/authorizedAxiosClient';
import { API_ROOT } from '../../utils/constants';

const chatApi = {
  createConversation: (userId, model = 'qwen-7b') =>
    authorizedAxiosInstance.post(`${API_ROOT}/chat/conversation`, { userId, model }),

  sendMessage: (conversationId, message, model = 'qwen-7b') =>
    authorizedAxiosInstance.post(`${API_ROOT}/chat/message`, { conversationId, message, model }),

  getConversations: (userId) =>
    authorizedAxiosInstance.get(`${API_ROOT}/chat/conversations/${userId}`),

  getMessages: (conversationId) =>
    authorizedAxiosInstance.get(`${API_ROOT}/chat/messages/${conversationId}`),

  deleteConversation: (conversationId) =>
    authorizedAxiosInstance.delete(`${API_ROOT}/chat/conversation/${conversationId}`),
}

export default chatApi