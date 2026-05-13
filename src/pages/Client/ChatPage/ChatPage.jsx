/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { IoSendSharp } from "react-icons/io5";
import { AlertTriangle, Info, Plus, Mic } from "lucide-react"; // Thêm icon Plus
import { useOutletContext } from 'react-router-dom';
import { speechToText } from '../../../apis/Client/chat.api';
import SmoothTyping from "../../../components/Client/SmoothTyping"
import DynamicLoading from "../../../components/Client/DynamicLoading"
import TypewriterMessage from "../../../components/Client/TypewriterMessage"
import UserMessageBubble from "../../../components/Client/UserMessageBubble"
import ExpandableMarkdown from "../../../components/Client/ExpandableMarkdown"

const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useState('qwen');
  const { setIsMobileMenuOpen, fontSize, messages, loading, sendMessage, isLimitReached } = useOutletContext();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // AUTO SCROLL XỊN SÒ (Dùng MutationObserver để theo dõi chữ rớt xuống theo thời gian thực)
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    // Quan sát xem có thẻ <p> nào mới mọc ra hoặc text dài ra không
    const observer = new MutationObserver(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    observer.observe(chatContainer, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    const textToSend = inputText;
    setInputText('');
    setSelectedImage(null);
    await sendMessage(textToSend, selectedModel); 
  };

  const handleResend = async (text) => {
    await sendMessage(text, selectedModel);
  };

  const getTextSizeClass = () => {
    if (fontSize === 'small') return 'text-base';
    if (fontSize === 'large') return 'text-2xl';
    return 'text-xl';
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
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());
        try {
          const res = await speechToText(audioBlob);
          const text = res.text || res.data?.text; 
          if (text) {
             setInputText(text);
             await sendMessage(text, selectedModel);
          }
        } catch (err) {
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
    if (file && file.type.startsWith('image/')) setSelectedImage(file);
    else alert('Vui lòng chọn một file hình ảnh.');
    e.target.value = null; 
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] relative">
      
      <header className="md:hidden bg-white border-b text-gray-800 p-4 flex items-center justify-between shadow-sm z-20">
        <h1 className="text-xl font-bold flex items-center gap-2">Bác sĩ Ảo</h1>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-2xl p-2 rounded-lg">☰</button>
      </header>

      {/* KHU VỰC HIỂN THỊ TIN NHẮN */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" ref={chatContainerRef}>
        {(messages ?? []).map((msg, index) => (
          <div key={msg.id || index} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#da7756] text-white shadow-sm font-semibold">
                AI
              </div>
            )}

            {/* TIN NHẮN CỦA USER LÀM KIỂU MỚI BÊN TRÊN */}
            {msg.role === 'user' ? (
              <UserMessageBubble msg={msg} onResend={handleResend} />
            ) : (
              /* TIN NHẮN CỦA AI */
              <div className="py-2 max-w-[85%] md:max-w-[85%] w-full">
                
                {msg.content && (
                   <ExpandableMarkdown content={msg.content} isStreaming={loading && msg.isNew} />
                )}

                {/* CÁC THÀNH PHẦN PHỤ CỦA AI */}
                <div className="mt-3 flex flex-col gap-2">
                  
                  {msg.risk_level === 'high' && (
                     <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-2 items-start shadow-sm mt-2">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500"/>
                        <div>
                           <strong className="block mb-1">Cảnh báo y tế:</strong> 
                           Triệu chứng có thể nguy hiểm. Đề nghị đến cơ sở y tế gần nhất hoặc gọi cấp cứu ngay lập tức!
                        </div>
                     </div>
                  )}

                  {/* NGUỒN THAM KHẢO CHỈ XUẤT HIỆN SAU KHI STREAM XONG (!loading) */}
                  {!loading && msg.sources && msg.sources.length > 0 && (
                     <div className="pt-3 border-t border-gray-200 mt-2">
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                           <Info size={14} /> Nguồn tham khảo:
                        </div>
                        <ul className="text-xs text-gray-500 list-disc list-inside">
                           {msg.sources.map((source, idx) => (
                              <li key={idx} className="truncate">{source?.name || 'Tài liệu chuyên ngành'}</li>
                           ))}
                        </ul>
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && <DynamicLoading />}
        <div ref={messagesEndRef} className="h-4" />
      </div>
      
      {/* KHU VỰC FORM NHẬP TEXT */}
      <div className="p-4 md:p-6 w-full flex justify-center z-10 bg-gradient-to-t from-[#f9f9f9] to-transparent">
        <div className="w-full max-w-3xl flex flex-col items-center relative">
          
          {isLimitReached && (
            <div className="w-full bg-[#1e1e1e] text-[#ececec] text-sm py-2.5 px-4 rounded-t-xl flex justify-between items-center mb-[-12px] shadow-md z-0 pb-4">
              <span className="font-medium">Phiên này đã hết hạn sử dụng.</span>
              <button onClick={() => window.location.reload()} className="text-gray-300 hover:text-white underline text-xs font-semibold">
                Bắt đầu mới
              </button>
            </div>
          )}

          <form 
            onSubmit={handleSend} 
            className={`w-full flex flex-col bg-[#f4f4f4] rounded-2xl md:rounded-[24px] shadow-sm border border-gray-200 p-2 z-10 transition-all duration-300 ${isLimitReached ? 'opacity-80' : ''}`}
          >
            <input 
              type="text" 
              placeholder="Write a message..." 
              className={`flex-1 bg-transparent px-3 pt-2 pb-6 text-base md:text-lg outline-none ${isLimitReached ? 'cursor-not-allowed text-gray-400' : 'text-gray-800'}`} 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              disabled={isRecording || isLimitReached} 
            />
            
            {/* Hàng công cụ bên dưới đáy Form */}
            <div className="flex items-center justify-between px-1 pb-1">
              
              {/* Bên Trái: Các nút tiện ích (+, Mic) */}
              <div className="flex items-center gap-1">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={isLimitReached}/>
                <button type="button" onClick={handlePlusClick} disabled={isLimitReached} className="p-2 text-gray-400 hover:text-gray-700 transition rounded-full">
                   <Plus size={20} />
                </button>
                {!inputText.trim() && !selectedImage && (
                  <button type="button" onClick={handleVoiceClick} disabled={isLimitReached} className={`p-2 transition rounded-full ${isRecording ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:text-gray-700'}`}>
                    <Mic />
                  </button>
                )}
              </div>

              {/* Bên Phải: Chọn Mô Hình & Nút Gửi */}
              <div className="flex items-center gap-2">
                <div className="relative group">
                   <select 
                     value={selectedModel} 
                     onChange={(e) => setSelectedModel(e.target.value)} 
                     disabled={isLimitReached}
                     className="appearance-none bg-transparent hover:bg-gray-200/50 text-gray-500 font-medium text-[13px] md:text-sm py-1.5 pl-3 pr-6 rounded-lg cursor-pointer outline-none transition"
                   >
                     <option value="qwen">Qwen Adaptive</option>
                     <option value="gemini">Gemini Pro</option>
                     <option value="claude">Claude Sonnet</option>
                   </select>
                   <span className="absolute right-2 top-[10px] text-gray-400 pointer-events-none text-xs">▼</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isLimitReached || (!inputText.trim() && !selectedImage)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition duration-300 ${(!inputText.trim() && !selectedImage) || isLimitReached ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 shadow-md'}`}
                >
                  <IoSendSharp size={16} />
                </button>
              </div>

            </div>
          </form>
          <div className="text-center mt-2 text-xs text-gray-400">
            Bác sĩ Ảo có thể mắc sai lầm. Vui lòng kiểm tra lại thông tin.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;