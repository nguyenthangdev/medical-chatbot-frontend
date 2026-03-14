/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { IoSendSharp } from "react-icons/io5";
import { useOutletContext } from 'react-router-dom'; // 1. Import hook này
// Thêm import ở đầu file
import chatApi from '../../../apis/Client/chat.api';

// Hoặc nếu bạn gọi qua backend thì dùng chatApi
const ChatPage = () => {
  // State quản lý Model đang được chọn (Mặc định là GPT-4)
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  // 1. Lấy thêm biến fontSize từ context
  const { setIsMobileMenuOpen, fontSize, messages, loading, sendMessage } = useOutletContext()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading]) // scroll khi có tin nhắn mới hoặc loading thay đổi

  // 2. Tạo một hàm nhỏ để dịch 'small', 'medium', 'large' thành class Tailwind
  const getTextSizeClass = () => {
    if (fontSize === 'small') return 'text-base'; // Cỡ nhỏ
    if (fontSize === 'large') return 'text-2xl';  // Cỡ to
    return 'text-xl';                             // Cỡ vừa (mặc định của bạn)
  };

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null)       // ← thêm
  const audioChunksRef = useRef([])           // ← thêm
  const [selectedImage, setSelectedImage] = useState(null);
  
  const fileInputRef = useRef(null);

  // XÓA toàn bộ handleSend cũ, THAY bằng:
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    setInputText('');
    setSelectedImage(null);
    await sendMessage(inputText); // gọi hook
  };

  const handleVoiceClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      stream.getTracks().forEach(t => t.stop())

      try {
        // Gọi STT (mock hoặc thật)
        const res = await chatApi.speechToText(audioBlob)
        const text = res.data.text

        setInputText(text) // điền text vào input

        // Tự động gửi luôn không cần bấm nút
        await sendMessage(text)
      } catch (err) {
        alert('Lỗi nhận dạng giọng nói. Vui lòng thử lại.')
      }
    }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      alert('Không thể truy cập microphone. Vui lòng cấp quyền.')
    }
  }
//   const handleVoiceClick = () => {
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//   if (!SpeechRecognition) {
//     alert('Trình duyệt không hỗ trợ nhận dạng giọng nói')
//     return
//   }

//   const recognition = new SpeechRecognition()
//   recognition.lang = 'vi-VN' // tiếng Việt
//   recognition.interimResults = false

//   recognition.onstart = () => setIsRecording(true)
//   recognition.onend = () => setIsRecording(false)

//   recognition.onresult = async (e) => {
//     const text = e.results[0][0].transcript
//     await sendMessage(text) // gửi luôn
//   }

//   recognition.onerror = (e) => {
//     setIsRecording(false)
//     console.log('Speech error:', e.error) // ← xem log này
//     alert('Lỗi nhận dạng. Thử lại nhé.')
//   }

//   recognition.start()
// }
  const handlePlusClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    } else {
      alert('Vui lòng chọn một file hình ảnh.');
    }
    e.target.value = null; 
  };

  const handleRemoveImage = () => setSelectedImage(null);

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      
      {/* Header cho Mobile */}
      <header className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between shadow-md z-20">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path fillRule="evenodd" d="M11.99 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75zM9 11.25a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5a.75.75 0 00-1.5 0v1.5H9z" clipRule="evenodd" />
          </svg>
          Bác sĩ Ảo
        </h1>
        
        {/* 3. Gắn sự kiện click vào nút Menu để bật Sidebar */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="text-2xl p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          ☰
        </button>
      </header>

      {/* THANH CHỌN MODEL AI (Responsive: Đẹp trên cả Mobile và Desktop) */}
      <div className="absolute top-[76px] md:top-4 left-0 w-full flex justify-center z-10 px-4 md:px-0">
        <div className="w-full max-w-[340px] md:max-w-max bg-white/90 backdrop-blur-md p-1 md:p-1.5 rounded-full shadow-sm border border-blue-100/50 flex gap-1 justify-between md:justify-center">
          <button
            onClick={() => setSelectedModel('gpt-4')}
            className={`flex-1 md:flex-none px-2 md:px-6 py-1.5 md:py-2 rounded-full text-[15px] md:text-lg font-medium transition-all duration-300 ${
              selectedModel === 'gpt-4' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            GPT-4
          </button>
          <button
            onClick={() => setSelectedModel('gemini')}
            className={`flex-1 md:flex-none px-2 md:px-6 py-1.5 md:py-2 rounded-full text-[15px] md:text-lg font-medium transition-all duration-300 ${
              selectedModel === 'gemini' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Gemini
          </button>
          <button
            onClick={() => setSelectedModel('claude')}
            className={`flex-1 md:flex-none px-2 md:px-6 py-1.5 md:py-2 rounded-full text-[15px] md:text-lg font-medium transition-all duration-300 ${
              selectedModel === 'claude' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Claude
          </button>
        </div>
      </div>

      {/* Khu vực hiển thị tin nhắn (Thêm pt-20 để không bị thanh chọn model đè lên tin nhắn trên cùng) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-24 space-y-6">
        {(messages ?? []).map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-sm ${msg.role === 'assistant' ? 'bg-blue-500' : 'bg-gray-400'}`}>
              {msg.role === 'assistant' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              )}
            </div>

            <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-sm leading-relaxed ${getTextSizeClass()}
                ${msg.role === 'assistant' ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-blue-600 text-white rounded-tr-none'}`}
            >
              {msg.imageUrl && (
                <img 
                  src={msg.imageUrl} 
                  alt="User uploaded" 
                  className="max-w-full rounded-xl mb-2 border border-white/20 shadow-sm"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              )}
              {msg.content && <p>{msg.content}</p>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực nhập liệu */}
      <div className="p-4 md:p-6 w-full flex justify-center z-10">
        <div className="w-full max-w-4xl flex flex-col items-center relative">
          
          {selectedImage && (
            <div className="w-full bg-white rounded-2xl p-4 mb-3 shadow-lg border border-gray-200 flex items-start justify-between animate-fade-in relative z-20">
              <div className="flex items-center gap-4">
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">{selectedImage.name}</span>
                  <span className="text-sm text-gray-500">Đã đính kèm ảnh</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <form 
            onSubmit={handleSend}
            className={`w-full flex items-center gap-2 bg-white rounded-[32px] pl-3 pr-2 py-2 shadow-[0_0_15px_rgba(0,0,0,0.05)] border transition-colors ${
              isRecording ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus-within:border-blue-300'
            }`}
          >
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />

            <button 
              type="button" 
              onClick={handlePlusClick}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>

            <input 
              type="text" 
              placeholder={isRecording ? "Đang nghe..." : "Hỏi bác sĩ bất cứ điều gì..."} 
              className={`flex-1 bg-transparent px-2 py-3 text-[19px] outline-none font-normal w-full transition-colors ${
                isRecording ? 'text-red-600 placeholder-red-400' : 'text-gray-800 placeholder-gray-400'
              }`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isRecording}
            />

            <div className="flex items-center pr-1">
              {!inputText.trim() && !selectedImage && (
                <button 
                  type="button"
                  onClick={handleVoiceClick}
                  className={`p-2.5 rounded-full transition-colors ${
                    isRecording 
                      ? 'text-red-500 bg-red-100 animate-pulse' 
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}

              {(inputText.trim() || selectedImage) && (
                <button 
                  type="submit"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-300 transform scale-100 pl-1"
                >
                  <IoSendSharp size={20} />
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-gray-500 text-sm mt-3 font-normal">
            Trợ lý y tế ảo có thể mắc lỗi. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ChatPage;