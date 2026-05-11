/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react'
import { createConversation, sendMessages, getMessages } from '../../apis/Client/chat.api'

// Thêm tham số onChatUpdated
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
        },
      ])

      // GỌI HÀM NÀY ĐỂ BÁO SIDEBAR CẬP NHẬT LẠI DANH SÁCH (Bao gồm cả Title mới)
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