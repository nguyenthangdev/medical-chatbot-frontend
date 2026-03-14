/* eslint-disable no-unused-vars */
import { useState, useCallback, useRef } from 'react'
import chatApi from '../apis/Client/chat.api'

export const useChat = (userId) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const conversationIdRef = useRef(null)

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || loading) return
    setError(null)

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message, createdAt: new Date() },
    ])
    setLoading(true)

    try {
      if (!conversationIdRef.current) {
        const res = await chatApi.createConversation(userId)
        conversationIdRef.current = res.data.conversationId
      }

      const res = await chatApi.sendMessage(conversationIdRef.current, message)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.response,
          model: res.data.model_used,
          createdAt: new Date(),
        },
      ])
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [userId, loading])

  const loadConversation = useCallback(async (conversationId) => {
    try {
      conversationIdRef.current = conversationId
      const res = await chatApi.getMessages(conversationId)
      setMessages(res.data)
      setError(null)
    } catch (err) {
      setError('Không thể tải lịch sử chat.')
    }
  }, [])

  const clearChat = useCallback(() => {
    conversationIdRef.current = null
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, conversationId: conversationIdRef.current, sendMessage, loadConversation, clearChat }
}