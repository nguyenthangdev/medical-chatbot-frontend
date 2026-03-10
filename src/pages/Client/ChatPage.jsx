import React, { useState } from 'react';
import { IoSendSharp } from "react-icons/io5";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Chào bác. Tôi là Bác sĩ Ảo. Bác đang cảm thấy trong người như thế nào? Cứ miêu tả chi tiết, hoặc bấm nút Micro để nói cho tôi nghe nhé!'
    },
    {
      id: 2,
      role: 'user',
      content: 'Chào bác sĩ, hôm nay tôi bị đau đầu và hơi buồn nôn từ sáng.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setMessages([...messages, { id: Date.now(), role: 'user', content: inputText }]);
    setInputText('');
  };

  const handleVoiceClick = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* Header cho Mobile */}
      <header className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between shadow-md z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          {/* Icon Y tế dạng SVG thay vì Emoji */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path fillRule="evenodd" d="M11.99 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75zM9 11.25a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5a.75.75 0 00-1.5 0v1.5H9z" clipRule="evenodd" />
          </svg>
          Bác sĩ Ảo
        </h1>
        <button className="text-2xl">☰</button>
      </header>

      {/* Khu vực hiển thị tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            {/* Avatar hiện đại */}
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-sm ${msg.role === 'assistant' ? 'bg-blue-500' : 'bg-gray-400'}`}>
              {msg.role === 'assistant' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                 </svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                 </svg>
              )}
            </div>

            {/* Bubble Chat */}
            <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-sm leading-relaxed text-xl
                ${msg.role === 'assistant' 
                  ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
                  : 'bg-blue-600 text-white rounded-tr-none'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* KHU VỰC NHẬP LIỆU - PHONG CÁCH CHATGPT */}
<div className="p-4 md:p-6 w-full flex justify-center z-10">
  <div className="w-full max-w-4xl flex flex-col items-center">
    
    <form 
      onSubmit={handleSend}
      className={`w-full flex items-center gap-2 bg-white rounded-[32px] pl-3 pr-2 py-2 shadow-[0_0_15px_rgba(0,0,0,0.05)] border transition-colors ${
        isRecording ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus-within:border-blue-300'
      }`}
    >
      
      {/* Nút Dấu Cộng (+) bên trái */}
      <button type="button" className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Ô nhập chữ */}
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

      {/* Nhóm Nút bên phải (Micro & Send) */}
      <div className="flex items-center pr-1">
        
        {/* Nút Micro: CHỈ HIỆN KHI Ô NHẬP TRỐNG (Không có chữ) */}
        {!inputText.trim() && (
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

        {/* Nút Gửi: CHỈ HIỆN KHI NGƯỜI DÙNG BẮT ĐẦU GÕ CHỮ */}
        {inputText.trim() && (
          <button 
            type="submit"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-300 transform scale-100"
          >
            <IoSendSharp />
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