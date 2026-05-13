// /* eslint-disable no-unused-vars */
// import { useState, useCallback } from 'react'
// // 1. SỬA ĐỔI IMPORT: Import thêm hàm streamMessageFromAPI
// import { createConversation, getMessages, streamMessageFromAPI } from '../../apis/Client/chat.api'

// export const useChat = (userId, onChatUpdated) => {
//   const [messages, setMessages] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [conversationId, setConversationId] = useState(null) 

//   const sendMessage = useCallback(async (message, selectedModel = 'qwen') => {
//     if (!message.trim() || loading) return
//     setError(null)

//     // 2. TẠO ID TẠM CHO TIN NHẮN AI: Để lát nữa React biết nối chữ vào đúng dòng nào
//     const tempAiMessageId = Date.now() + 1;

//     setMessages((prev) => [
//       ...prev,
//       { role: 'user', content: message, createdAt: new Date() },
//       // 3. THÊM SẴN 1 TIN NHẮN AI RỖNG LÊN GIAO DIỆN
//       {
//         id: tempAiMessageId, 
//         role: 'assistant',
//         content: '', // Bắt đầu với nội dung rỗng
//         model: selectedModel,
//         createdAt: new Date(),
//         isNew: true
//       }
//     ])
//     setLoading(true)

//     try {
//       let currentId = conversationId; 

//       if (!currentId) {
//         const res = await createConversation(userId, selectedModel)
//         currentId = res.conversationId 
//         setConversationId(currentId)   
//       }
//       console.log("currentId: ", currentId)
//       // 4. GỌI HÀM STREAM THAY VÌ HÀM CŨ
//       await streamMessageFromAPI(currentId, message, selectedModel, (newTextChunk) => {
//         // Hàm callback này sẽ được kích hoạt liên tục 0.1s/lần khi có chữ mới rơi xuống
//         setMessages((prev) => 
//           prev.map(msg => {
//             if (msg.id === tempAiMessageId) {
//               // Nối từ mới vào đuôi câu trả lời cũ
//               return { ...msg, content: msg.content + newTextChunk };
//             }
//             return msg;
//           })
//         );
//       })

//       // Khi toàn bộ stream chạy xong thì sẽ gọi cập nhật Sidebar
//       if (onChatUpdated) onChatUpdated();

//     } catch (err) {
//       setError(err.message || 'Lỗi kết nối. Vui lòng thử lại.')
//     } finally {
//       setLoading(false)
//     }
//   }, [userId, loading, conversationId, onChatUpdated]) 

//   const loadConversation = useCallback(async (id) => {
//     try {
//       setConversationId(id) 
//       const res = await getMessages(id)
//       setMessages(res)
//       setError(null)
//     } catch (err) {
//       setError('Không thể tải lịch sử chat.')
//     }
//   }, [])

//   const clearChat = useCallback(() => {
//     setConversationId(null) 
//     setMessages([])
//     setError(null)
//   }, [])

//   return { messages, loading, error, conversationId, sendMessage, loadConversation, clearChat }
// }

/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react'
import { createConversation, sendMessages, getMessages } from '../../apis/Client/chat.api'

export const useChat = (userId, onChatUpdated) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [conversationId, setConversationId] = useState(null) 

  const sendMessage = useCallback(async (message, selectedModel = 'qwen') => {
    if (!message.trim() || loading) return
    setError(null)

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message, createdAt: new Date() },
    ])
    setLoading(true)

    try {
      let currentId = conversationId; 

      if (!currentId) {
        const res = await createConversation(userId, selectedModel)
        currentId = res.conversationId 
        setConversationId(currentId)   
      }

      const res = await sendMessages(currentId, message, selectedModel)
      console.log("res from useChat: ", res)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.response,
          model: res.model_used,
          risk_level: res.risk_level,
          blocked: res.blocked,
          warnings: res.warnings,
          sources: res.sources,
          createdAt: new Date(),
          isNew: true
        },
      ])

      // BÁO SIDEBAR CẬP NHẬT LẠI DANH SÁCH (Bao gồm cả Title mới)
      if (onChatUpdated) onChatUpdated();

    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [userId, loading, conversationId, onChatUpdated]) 

  const loadConversation = useCallback(async (id) => {
    try {
      setConversationId(id) 
      const res = await getMessages(id)
      setMessages(res)
      setError(null)
    } catch (err) {
      setError('Không thể tải lịch sử chat.')
    }
  }, [])

  const clearChat = useCallback(() => {
    setConversationId(null) 
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, conversationId, sendMessage, loadConversation, clearChat }
}