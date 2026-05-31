/* eslint-disable no-misleading-character-class */
/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { createConversation, sendMessages, getMessages } from '../../apis/Client/chat.api'

const normalizePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const MAX_MESSAGE_CHARS = normalizePositiveInteger(import.meta.env.VITE_CHAT_MAX_MESSAGE_CHARS, 4000)

export const useChat = (userId, onChatUpdated) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [error, setError] = useState(null)
  const [conversationId, setConversationId] = useState(null) 
  const loadRequestRef = useRef(0)
  
  // Thêm State kiểm tra xem phiên này đã hết hạn mức chưa
  const [isLimitReached, setIsLimitReached] = useState(false)
  const [tokenQuota, setTokenQuota] = useState(null)
  const unlockTimerRef = useRef(null)

  const clearUnlockTimer = useCallback(() => {
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current)
      unlockTimerRef.current = null
    }
  }, [])

  const unlockTokenLimit = useCallback(() => {
    clearUnlockTimer()
    setIsLimitReached(false)
    setTokenQuota(null)
  }, [clearUnlockTimer])

  const scheduleTokenUnlock = useCallback((quota) => {
    clearUnlockTimer()
    if (!quota?.resetAt) return

    const delayMs = new Date(quota.resetAt).getTime() - Date.now()
    if (delayMs <= 0) {
      unlockTokenLimit()
      return
    }

    unlockTimerRef.current = setTimeout(unlockTokenLimit, delayMs)
  }, [clearUnlockTimer, unlockTokenLimit])

  useEffect(() => () => clearUnlockTimer(), [clearUnlockTimer])

  const sendMessage = useCallback(async (message, selectedModel = 'qwen', options = {}) => {
    // Nếu đang loading hoặc đã hết hạn mức thì chặn không cho gửi
    if (!message.trim() || loading || loadingConversation || isLimitReached) return null
    const messageLength = [...message.trim()].length

    if (messageLength > MAX_MESSAGE_CHARS) {
      const warningResponse = `⚠️ **Tin nhắn quá dài:** Nội dung hiện có ${messageLength} ký tự, vượt quá giới hạn ${MAX_MESSAGE_CHARS} ký tự. Vui lòng rút ngắn nội dung rồi gửi lại.`
      setError(null)
      toast.warning(`Tin nhắn quá dài: Nội dung hiện có ${messageLength} ký tự, vượt quá giới hạn ${MAX_MESSAGE_CHARS} ký tự. Vui lòng rút ngắn nội dung rồi gửi lại.`, {
        toastId: 'message-too-long',
      })

      return {
        type: 'MESSAGE_TOO_LONG',
        response: warningResponse,
        messageLimit: {
          maxChars: MAX_MESSAGE_CHARS,
          currentChars: messageLength,
        },
      }
    }

    setError(null)

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message, createdAt: new Date() },
    ])
    setLoading(true)

    try {
      let currentId = conversationId; 

      if (!currentId) {
        const res = await createConversation(userId, selectedModel, { signal: options.signal })
        currentId = res.conversationId 
        setConversationId(currentId)   
      }
      options.onConversationReady?.(currentId)

      const res = await sendMessages(currentId, message, selectedModel, { signal: options.signal })

      // LOGIC KIỂM TRA HẠN MỨC
      if (res.response && res.response.includes('Hết hạn mức')) {
        // Bật cờ khóa khung chat
        setIsLimitReached(true);
        setTokenQuota(res.tokenQuota || null);
        scheduleTokenUnlock(res.tokenQuota);
        // Lưu ý: Ta KHÔNG gọi setMessages để push câu chửi này vào khung chat nữa.
      } else if (res.type === 'MESSAGE_TOO_LONG') {
        toast.warning(res.response?.replace(/[*⚠️]/g, '') || 'Tin nhắn quá dài. Vui lòng rút ngắn nội dung rồi gửi lại.', {
          toastId: 'message-too-long',
        });
      } else {
        setIsLimitReached(false);
        setTokenQuota(null);
        clearUnlockTimer();
        // Nếu bình thường thì vẫn push tin nhắn AI lên
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
      }

      if (onChatUpdated) onChatUpdated();
      return { ...res, conversationId: currentId };

    } catch (err) {
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
        return null;
      }
      setError(err.response?.data?.error || 'Lỗi kết nối. Vui lòng thử lại.')
      return null;
    } finally {
      setLoading(false)
    }
  }, [userId, loading, loadingConversation, conversationId, onChatUpdated, isLimitReached, scheduleTokenUnlock, clearUnlockTimer]) 

  const loadConversation = useCallback(async (id) => {
    const requestId = loadRequestRef.current + 1
    loadRequestRef.current = requestId

    try {
      setConversationId(id) 
      setMessages([])
      setLoadingConversation(true)
      const res = await getMessages(id)
      if (loadRequestRef.current !== requestId) return
      setMessages(res)
      setError(null)
      setIsLimitReached(false) // Khi load đoạn chat cũ, mặc định mở khóa
      setTokenQuota(null)
      clearUnlockTimer()
    } catch (err) {
      if (loadRequestRef.current !== requestId) return
      setError('Không thể tải lịch sử chat.')
    } finally {
      if (loadRequestRef.current === requestId) {
        setLoadingConversation(false)
      }
    }
  }, [clearUnlockTimer])

  const clearChat = useCallback(() => {
    loadRequestRef.current += 1
    setConversationId(null) 
    setMessages([])
    setLoadingConversation(false)
    setError(null)
    setIsLimitReached(false) // Reset khi tạo chat mới
    setTokenQuota(null)
    clearUnlockTimer()
  }, [clearUnlockTimer])

  const appendAssistantMessage = useCallback((content, extra = {}) => {
    if (!content?.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content,
        createdAt: new Date(),
        isNew: true,
        ...extra
      },
    ])
  }, [])

  // 3. NHỚ RETURN isLimitReached RA NGOÀI ĐỂ UI SỬ DỤNG
  return { messages, loading, loadingConversation, error, conversationId, isLimitReached, sendMessage, loadConversation, clearChat, appendAssistantMessage }
}
