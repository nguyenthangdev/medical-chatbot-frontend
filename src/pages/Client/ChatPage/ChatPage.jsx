/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { IoSendSharp } from "react-icons/io5";
import { AlertTriangle, Info } from "lucide-react"; // Thêm icon cảnh báo
import { useOutletContext } from 'react-router-dom';
import { speechToText } from '../../../apis/Client/chat.api';
import SmoothTyping from "../../../components/Client/SmoothTyping"
import DynamicLoading from "../../../components/Client/DynamicLoading"

const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useState('qwen');
  const { setIsMobileMenuOpen, fontSize, messages, loading, sendMessage } = useOutletContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const getTextSizeClass = () => {
    if (fontSize === 'small') return 'text-base';
    if (fontSize === 'large') return 'text-2xl';
    return 'text-xl';
  };

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    const textToSend = inputText;
    setInputText('');
    setSelectedImage(null);
    
    // Gửi tin nhắn kèm theo model đang chọn
    await sendMessage(textToSend, selectedModel); 
  };

  const handleVoiceClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());

        try {
          // GỌI API STT TỪ BACKEND
          const res = await speechToText(audioBlob);
          // CHÚ Ý: Vì chat.api.js đã return response.data, nên ở đây lấy thẳng res.text
          const text = res.text || res.data?.text; 

          if (text) {
             setInputText(text);
             await sendMessage(text, selectedModel);
          }
        } catch (err) {
          console.error(err);
          alert('Lỗi nhận dạng giọng nói. Vui lòng thử lại.');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Không thể truy cập microphone. Vui lòng cấp quyền.');
    }
  };

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
      
      {/* Header Mobile & Navbar Chọn Model giữ nguyên như cũ... */}
      <header className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between shadow-md z-20">
        <h1 className="text-xl font-bold flex items-center gap-2">Bác sĩ Ảo</h1>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-2xl p-2 hover:bg-blue-700 rounded-lg">☰</button>
      </header>

      <div className="absolute top-[76px] md:top-4 left-0 w-full flex justify-center z-10 px-4 md:px-0">
        <div className="w-full max-w-[340px] md:max-w-max bg-white/90 backdrop-blur-md p-1 md:p-1.5 rounded-full shadow-sm border border-blue-100/50 flex gap-1 justify-between md:justify-center">
          {['qwen', 'gemini', 'claude'].map(model => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`flex-1 md:flex-none px-2 md:px-6 py-1.5 md:py-2 rounded-full text-[15px] md:text-lg font-medium capitalize transition-all duration-300 ${
                selectedModel === model ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ TIN NHẮN */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-24 space-y-6">
        {(messages ?? []).map((msg, index) => (
          <div key={msg.id || index} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            {/* Avatar AI / User */}
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-sm ${msg.role === 'assistant' ? 'bg-blue-500' : 'bg-gray-400'}`}>
              {msg.role === 'assistant' ? "AI" : "U"}
            </div>

            {/* Bubble Chat */}
            <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-sm leading-relaxed ${getTextSizeClass()}
                ${msg.role === 'assistant' ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-blue-600 text-white rounded-tr-none'}`}
            >
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="User uploaded" className="max-w-full rounded-xl mb-2 border border-white/20 shadow-sm" style={{ maxHeight: '300px', objectFit: 'contain' }} />
              )}
              
              {/* Nội dung tin nhắn */}
              {/* {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>} */}
              {msg.content && (
                (msg.role === 'assistant' && msg.isNew) 
                  ? <SmoothTyping text={msg.content} /> 
                  : <p className="whitespace-pre-wrap">{msg.content}</p>
              )}

              {/* TÍNH NĂNG ĐẶC BIỆT DÀNH CHO AI ASSISTANT */}
              {msg.role === 'assistant' && (
                <div className="mt-3 flex flex-col gap-2">
                  
                  {/* Hiển thị cảnh báo mức độ rủi ro CAO */}
                  {msg.risk_level === 'high' && (
                     <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-2 items-start shadow-sm mt-2">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500"/>
                        <div>
                           <strong className="block mb-1">Cảnh báo y tế:</strong> 
                           Triệu chứng có thể nguy hiểm. Đề nghị đến cơ sở y tế gần nhất hoặc gọi cấp cứu (115) ngay lập tức!
                        </div>
                     </div>
                  )}

                  {/* Hiển thị Nguồn trích dẫn (RAG) */}
                  {msg.sources && msg.sources.length > 0 && (
                     <div className="pt-3 border-t border-gray-100 mt-2">
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                           <Info size={14} /> Một số thông tin liên quan:
                        </div>
                        <ul className="text-xs text-gray-400 list-disc list-inside">
                           {msg.sources.map((source, idx) => (
                              <li key={idx} className="truncate">
                                  {source?.name || 'Tài liệu tham khảo'} 
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {/* {loading && (
           <div className="flex gap-4 max-w-4xl mx-auto">
             <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">AI</div>
             <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-1">
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
           </div>
        )} */}
        {loading && <DynamicLoading />}
        <div ref={messagesEndRef} />
      </div>

      {/* Khu vực nhập liệu form giữ nguyên... */}
      <div className="p-4 md:p-6 w-full flex justify-center z-10">
        <div className="w-full max-w-4xl flex flex-col items-center relative">
          <form onSubmit={handleSend} className="w-full flex items-center gap-2 bg-white rounded-[32px] pl-3 pr-2 py-2 shadow-sm border border-gray-200">
            {/* Input giữ nguyên */}
            <input type="text" placeholder="Hỏi bác sĩ bất cứ điều gì..." className="flex-1 bg-transparent px-2 py-3 text-[19px] outline-none" value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isRecording} />
            
            <div className="flex items-center pr-1">
              {!inputText.trim() && !selectedImage && (
                <button type="button" onClick={handleVoiceClick} className={`p-2.5 rounded-full ${isRecording ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}>🎤</button>
              )}
              {(inputText.trim() || selectedImage) && (
                <button type="submit" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md"><IoSendSharp size={20} /></button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;