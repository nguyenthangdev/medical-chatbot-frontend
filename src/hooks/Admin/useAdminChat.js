import { useCallback, useState } from 'react'
import * as conversationApi from '../../apis/Admin/conversation.api'
import * as messageApi from '../../apis/Admin/message.api'

export const useAdminChat = () => {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Lấy danh sách conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await conversationApi.getConversationsAPI()
      // Transform data: nếu userId là object, lấy email hoặc fullName
      const transformedData = (response.data || []).map(conv => ({
        ...conv,
        userId: typeof conv.userId === 'object' ? (conv.userId?.fullName || conv.userId?.email || conv.userId?._id || 'Unknown') : conv.userId
      }))
      setConversations(transformedData)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy chi tiết conversation + messages
  const selectConversation = useCallback(async (conversationId) => {
    try {
      setLoading(true)
      setError(null)
      setSelectedConversation(conversationId)
      const response = await messageApi.getMessagesByConversation(conversationId)
      setMessages(response.data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cập nhật tiêu đề conversation
  const updateConversationTitle = useCallback(async (conversationId, title) => {
    try {
      setLoading(true)
      setError(null)
      await conversationApi.updateConversation(conversationId, { title })
      // Cập nhật local state
      setConversations(prev =>
        prev.map(conv => conv._id === conversationId ? { ...conv, title } : conv)
      )
    } catch (err) {
      setError(err.message)
      console.error('Error updating conversation:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Xóa conversation
  const deleteConversationItem = useCallback(async (conversationId) => {
    try {
      setLoading(true)
      setError(null)
      await conversationApi.deleteConversation(conversationId)
      setConversations(prev => prev.filter(conv => conv._id !== conversationId))
      if (selectedConversation === conversationId) {
        setSelectedConversation(null)
        setMessages([])
      }
    } catch (err) {
      setError(err.message)
      console.error('Error deleting conversation:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedConversation])

  // Xóa tin nhắn
  const deleteMessageItem = useCallback(async (messageId) => {
    try {
      setLoading(true)
      setError(null)
      await messageApi.deleteMessage(messageId)
      setMessages(prev => prev.filter(msg => msg._id !== messageId))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting message:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    conversations,
    messages,
    selectedConversation,
    loading,
    error,
    fetchConversations,
    selectConversation,
    updateConversationTitle,
    deleteConversationItem,
    deleteMessageItem
  }
}
