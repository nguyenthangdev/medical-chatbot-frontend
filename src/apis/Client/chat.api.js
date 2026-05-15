import authorizedAxiosInstance from '../../utils/authorizedAxiosClient';
import { API_ROOT } from '../../utils/constants';

export const createConversation = async (userId, model = 'qwen-7b', options = {}) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/conversation`, { userId, model }, {
    signal: options.signal
  });
  return response.data;
}

export const sendMessages = async (conversationId, message, model = 'qwen-7b', options = {}) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/message`, { conversationId, message, model }, {
    signal: options.signal
  });
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

export const deleteConversationAPI = async (conversationId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/v1/chat/conversation/${conversationId}`);
  return response.data;
}

export const renameConversationAPI = async (id, title) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/v1/chat/conversation/${id}`, { title });
  return response.data;
};

export const deleteAllConversationsAPI = async () => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/v1/chat/conversations/all`);
  return response.data;
};

export const speechToText = async (audioBlob, options = {}) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/stt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal: options.signal
  });
  return response.data;
}

export const textToSpeech = async (text, conversationId, options = {}) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/tts`, { text, conversationId }, {
    signal: options.signal
  });
  return response.data;
}

export const cancelChatResponse = async (conversationId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/v1/chat/cancel`, { conversationId });
  return response.data;
}

export const streamMessageFromAPI = async (conversationId, message, model, onChunk) => {
  const response = await fetch(`${API_ROOT}/api/v1/chat/message-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ conversationId, message, model })
  });

  if (!response.body) throw new Error('Trình duyệt không hỗ trợ ReadableStream');

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  // THÊM CÁI RỔ (BUFFER) Ở ĐÂY
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 1. Nhận mảnh vỡ từ mạng và ném vào rổ
    buffer += decoder.decode(value, { stream: true });

    // 2. Chặt các gói tin hoàn chỉnh dựa vào ký hiệu \n\n của SSE
    const parts = buffer.split('\n\n');

    // 3. Gói tin cuối cùng có thể bị mạng cắt dở, ta giữ lại trong rổ để vòng lặp sau ghép tiếp!
    buffer = parts.pop();

    for (const part of parts) {
      // const lines = part.split('\n');
      // for (const line of lines) {
      //   if (line.startsWith('data: ')) {
      //     const dataStr = line.replace('data: ', '');
          
      //     if (dataStr === '[DONE]') return; 
          
      //     // Dùng cho Metadata nếu bạn có cài đặt
      //     if (dataStr.startsWith('[METADATA] ')) continue; 
          
      //     if (dataStr !== '[ERROR]') {
      //       onChunk(dataStr); 
      //     }
      //   }
      // }
      if (part.startsWith('data: ')) {
        
        // Cắt 6 ký tự "data: " ở đầu, GIỮ NGUYÊN mọi dấu xuống dòng bên trong
        const dataStr = part.substring(6); 
        
        if (dataStr === '[DONE]') return; 
        
        // Bỏ qua cục Metadata nếu có
        if (dataStr.startsWith('[METADATA] ')) continue; 
        
        if (dataStr === '[ERROR]') continue;

        // Chặn đứng lỗi in chữ 'undefined' lên UI
        if (dataStr && dataStr !== 'undefined') {
          onChunk(dataStr); 
        }
      }
    }
  }
};
