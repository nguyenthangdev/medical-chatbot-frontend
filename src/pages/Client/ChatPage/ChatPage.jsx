/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { IoSendSharp } from "react-icons/io5";
import { AlertTriangle, Info, Plus, Mic, Sparkles } from "lucide-react"; // Thêm icon Plus
import { useNavigate, useOutletContext } from 'react-router-dom';
import { speechToText, textToSpeech } from '../../../apis/Client/chat.api';
import SmoothTyping from "../../../components/Client/SmoothTyping"
import DynamicLoading from "../../../components/Client/DynamicLoading"
import TypewriterMessage from "../../../components/Client/TypewriterMessage"
import UserMessageBubble from "../../../components/Client/UserMessageBubble"
import ExpandableMarkdown from "../../../components/Client/ExpandableMarkdown"

const getVietnamTime = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
};

const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useState('qwen');
  const { setIsMobileMenuOpen, fontSize, messages, loading, loadingConversation, sendMessage, isLimitReached, isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceState, setVoiceState] = useState('idle');
  const [voiceError, setVoiceError] = useState('');
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const responseAudioRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(() => getVietnamTime());
  const isNewChat = (messages ?? []).length === 0 && !loading && !loadingConversation;

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

  useEffect(() => {
    if ((messages ?? []).length === 0) return;

    const frameId = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    });

    return () => cancelAnimationFrame(frameId);
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getVietnamTime());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.state === 'recording' && mediaRecorderRef.current.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      responseAudioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
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

  const getVoiceStatusText = () => {
    if (voiceError) return voiceError;
    if (voiceState === 'recording') return 'Đang nghe bạn nói... Nhấn lại micro để gửi.';
    if (voiceState === 'transcribing') return 'Đang chuyển giọng nói thành văn bản...';
    if (voiceState === 'thinking') return 'Bác sĩ Ảo đang trả lời...';
    if (voiceState === 'speaking') return 'Bác sĩ Ảo đang phản hồi bằng giọng nói...';
    return '';
  };

  const stopVoicePlayback = () => {
    responseAudioRef.current?.pause();
    responseAudioRef.current = null;
    window.speechSynthesis?.cancel();
    setVoiceState('idle');
  };

  const speakWithBrowser = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !text?.trim()) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  };

  const playAssistantVoice = async (text) => {
    if (!text?.trim()) return;

    setVoiceState('speaking');
    try {
      const res = await textToSpeech(text);
      if (!res?.audio_url) throw new Error('Không có audio_url');

      await new Promise((resolve, reject) => {
        const audio = new Audio(res.audio_url);
        responseAudioRef.current = audio;
        audio.onended = resolve;
        audio.onerror = reject;
        audio.play().catch(reject);
      });
    } catch (error) {
      await speakWithBrowser(text);
    } finally {
      responseAudioRef.current = null;
      setVoiceState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleVoiceClick = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    if (voiceState === 'speaking') {
      stopVoicePlayback();
      return;
    }

    if (voiceState === 'transcribing' || voiceState === 'thinking') {
      return;
    }

    try {
      setVoiceError('');
      responseAudioRef.current?.pause();
      window.speechSynthesis?.cancel();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        setIsRecording(false);

        try {
          setVoiceState('transcribing');
          const res = await speechToText(audioBlob);
          const text = res.text || res.data?.text; 
          if (text) {
             setInputText('');
             setVoiceState('thinking');
             const chatResult = await sendMessage(text, selectedModel);
             const answer = chatResult?.response;
             if (answer && !answer.includes('Hết hạn mức')) {
               await playAssistantVoice(answer);
             } else {
               setVoiceState('idle');
             }
          } else {
            setVoiceError('Không nghe rõ nội dung. Vui lòng thử lại.');
            setVoiceState('idle');
          }
        } catch (err) {
          setVoiceError('Không thể xử lý giọng nói. Vui lòng thử lại.');
          setVoiceState('idle');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setVoiceState('recording');
    } catch (err) {
      setVoiceError('Không thể truy cập micro. Vui lòng cấp quyền trong trình duyệt.');
      setVoiceState('idle');
    }
  };

  const handlePlusClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) setSelectedImage(file);
    else alert('Vui lòng chọn một file hình ảnh.');
    e.target.value = null; 
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 11) return 'Chào buổi sáng, hôm nay bạn cần hỗ trợ gì?';
    if (hour < 14) return 'Chào buổi trưa, hôm nay bạn cần hỗ trợ gì?';
    if (hour < 18) return 'Chào buổi chiều, hôm nay bạn cần hỗ trợ gì?';
    return 'Chào buổi tối, hôm nay bạn cần hỗ trợ gì?';
  };

  const renderComposer = () => (
    <div className="w-full max-w-3xl flex flex-col items-center relative">
      
      {isLimitReached && (
        <div className="w-full bg-[#1e1e1e] text-[#ececec] text-sm py-2.5 px-4 rounded-t-xl flex justify-between items-center mb-[-12px] shadow-md z-0 pb-4">
          <span className="font-medium">Phiên này đã hết hạn sử dụng.</span>
          <button onClick={() => window.location.reload()} className="text-gray-300 hover:text-white underline text-xs font-semibold">
            Bắt đầu mới
          </button>
        </div>
      )}

      {(voiceState !== 'idle' || voiceError) && (
        <div className={`mb-3 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
          voiceError
            ? 'border-red-200 bg-red-50 text-red-700'
            : isDarkMode
              ? 'border-white/10 bg-white/5 text-gray-200'
              : 'border-gray-200 bg-white text-gray-700'
        }`}>
          <span className="font-medium">{getVoiceStatusText()}</span>
          <button
            type="button"
            onClick={() => {
              if (isRecording) stopRecording();
              stopVoicePlayback();
              setVoiceError('');
            }}
            className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              voiceError
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : isDarkMode
                  ? 'bg-white/10 text-gray-100 hover:bg-white/15'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {voiceState === 'recording' ? 'Gửi' : 'Dừng'}
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSend} 
        className={`w-full flex flex-col rounded-2xl md:rounded-[24px] shadow-sm border p-2 z-10 transition-all duration-300 ${
          isDarkMode ? 'bg-[#2b2b29] border-white/10' : 'bg-[#f4f4f4] border-gray-200'
        } ${isLimitReached ? 'opacity-80' : ''}`}
      >
        <input 
          type="text" 
          placeholder="Nhập tin nhắn..." 
          className={`flex-1 bg-transparent px-3 pt-2 pb-6 text-base md:text-lg outline-none ${isLimitReached ? 'cursor-not-allowed text-gray-400' : isDarkMode ? 'text-gray-100 placeholder:text-gray-500' : 'text-gray-800'}`} 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          disabled={isRecording || isLimitReached} 
        />
        
        {/* Hàng công cụ bên dưới đáy Form */}
        <div className="flex items-center justify-between px-1 pb-1">
          
          {/* Bên Trái: Các nút tiện ích (+, Mic) */}
          <div className="flex items-center gap-1">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={isLimitReached}/>
            <button type="button" onClick={handlePlusClick} disabled={isLimitReached} className={`p-2 transition rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-100' : 'text-gray-400 hover:text-gray-700'}`}>
               <Plus size={20} />
            </button>
            {!inputText.trim() && !selectedImage && (
              <button type="button" onClick={handleVoiceClick} disabled={isLimitReached || voiceState === 'transcribing' || voiceState === 'thinking'} className={`p-2 transition rounded-full ${
                isRecording
                  ? 'text-red-500 bg-red-100 animate-pulse'
                  : voiceState === 'speaking'
                    ? 'text-[#da7756] bg-[#da7756]/10'
                    : isDarkMode ? 'text-gray-400 hover:text-gray-100' : 'text-gray-400 hover:text-gray-700'
              }`}>
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
                 className={`appearance-none bg-transparent font-medium text-[13px] md:text-sm py-1.5 pl-3 pr-6 rounded-lg cursor-pointer outline-none transition ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-200/50'}`}
               >
                 <option className={isDarkMode ? 'bg-[#2b2b29] text-gray-100' : 'bg-white text-gray-800'} value="qwen">Qwen thích ứng</option>
                 <option className={isDarkMode ? 'bg-[#2b2b29] text-gray-100' : 'bg-white text-gray-800'} value="gemini">Gemini Pro</option>
                 <option className={isDarkMode ? 'bg-[#2b2b29] text-gray-100' : 'bg-white text-gray-800'} value="claude">Claude Sonnet</option>
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
      <div className={`text-center mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Bác sĩ Ảo có thể mắc sai lầm. Vui lòng kiểm tra lại thông tin.
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full relative ${isDarkMode ? 'bg-[#1f1f1f] text-gray-100' : 'bg-[#f9f9f9] text-gray-800'}`}>
      
      <header className={`md:hidden border-b p-4 flex items-center justify-between shadow-sm z-20 ${isDarkMode ? 'bg-[#252522] border-white/10 text-gray-100' : 'bg-white border-gray-200 text-gray-800'}`}>
        <h1 className="text-xl font-bold flex items-center gap-2">Bác sĩ Ảo</h1>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-2xl p-2 rounded-lg">☰</button>
      </header>

      {isNewChat && (
        <button
          type="button"
          onClick={() => navigate('/upgrade')}
          className={`absolute left-1/2 top-20 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium shadow-sm ring-1 transition md:top-5 ${
            isDarkMode ? 'bg-[#2b2b29] text-gray-300 ring-white/10 hover:bg-white/10 hover:text-white' : 'bg-white text-gray-600 ring-gray-200 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span>Gói miễn phí</span>
          <span className="text-gray-300">·</span>
          <span className="underline underline-offset-2">Nâng cấp</span>
        </button>
      )}

      {isNewChat ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
          <div className="mb-8 flex items-center gap-3 text-center">
            <Sparkles className="h-9 w-9 text-[#da7756]" />
            <h1 className="text-3xl font-semibold md:text-4xl">
              {getGreeting()}
            </h1>
          </div>
          {renderComposer()}
        </div>
      ) : (
      <>
      {/* KHU VỰC HIỂN THỊ TIN NHẮN */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" ref={chatContainerRef}>
        {loadingConversation && <DynamicLoading mode="conversation" isDarkMode={isDarkMode} />}
        {(messages ?? []).map((msg, index) => (
          <div key={msg._id || msg.id || index} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#da7756] text-white shadow-sm font-semibold">
                AI
              </div>
            )}

            {/* TIN NHẮN CỦA USER LÀM KIỂU MỚI BÊN TRÊN */}
            {msg.role === 'user' ? (
              <UserMessageBubble msg={msg} onResend={handleResend} isDarkMode={isDarkMode} />
            ) : (
              /* TIN NHẮN CỦA AI */
              <div className="py-2 max-w-[85%] md:max-w-[85%] w-full">
                
                {msg.content && (
                   <ExpandableMarkdown content={msg.content} isStreaming={loading && msg.isNew} isDarkMode={isDarkMode} />
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
                     <div className={`pt-3 border-t mt-2 ${isDarkMode ? 'border-white/15' : 'border-gray-200'}`}>
                        <div className={`flex items-center gap-1 text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                           <Info size={14} /> Một số thông tin liên quan:
                        </div>
                        <ul className={`text-xs list-disc list-inside ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
        {loading && <DynamicLoading isDarkMode={isDarkMode} />}
        <div ref={messagesEndRef} className="h-4" />
      </div>
      
      {/* KHU VỰC FORM NHẬP TEXT */}
      <div className={`p-4 md:p-6 w-full flex justify-center z-10 ${isDarkMode ? 'bg-gradient-to-t from-[#1f1f1f] to-transparent' : 'bg-gradient-to-t from-[#f9f9f9] to-transparent'}`}>
        {renderComposer()}
      </div>
      </>
      )}
    </div>
  );
};

export default ChatPage;
