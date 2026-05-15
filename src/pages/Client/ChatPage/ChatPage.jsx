/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { IoSendSharp } from "react-icons/io5";
import { AlertTriangle, Bot, Info, Menu, Mic, Paperclip, Sparkles, Square, Stethoscope } from "lucide-react";
import { useNavigate, useOutletContext } from 'react-router-dom';
import { cancelChatResponse, speechToText, textToSpeech } from '../../../apis/Client/chat.api';
import SmoothTyping from "../../../components/Client/SmoothTyping"
import DynamicLoading from "../../../components/Client/DynamicLoading"
import TypewriterMessage from "../../../components/Client/TypewriterMessage"
import UserMessageBubble from "../../../components/Client/UserMessageBubble"
import ExpandableMarkdown from "../../../components/Client/ExpandableMarkdown"

const getVietnamTime = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
};

const STOPPED_RESPONSE_MESSAGE = 'Đã dừng câu trả lời đang chạy.';

const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useState('qwen');
  const { setIsMobileMenuOpen, fontSize, messages, loading, loadingConversation, conversationId, sendMessage, appendAssistantMessage, isLimitReached, isDarkMode } = useOutletContext();
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
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const voiceAbortControllerRef = useRef(null);
  const voiceCanceledRef = useRef(false);
  const activeVoiceConversationRef = useRef(null);
  const voicePlaybackResolverRef = useRef(null);
  const audioChunksRef = useRef([]);
  const textAbortControllerRef = useRef(null);
  const activeTextConversationRef = useRef(null);
  const [isTextChatRunning, setIsTextChatRunning] = useState(false);
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
      voiceAbortControllerRef.current?.abort();
      textAbortControllerRef.current?.abort();
      voicePlaybackResolverRef.current?.();
      audioSourceRef.current?.disconnect();
      audioContextRef.current?.close();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const sendTextMessage = async (text) => {
    if (!text?.trim() || isTextChatRunning) return;

    const controller = new AbortController();
    textAbortControllerRef.current = controller;
    activeTextConversationRef.current = conversationId || null;
    setIsTextChatRunning(true);

    try {
      await sendMessage(text, selectedModel, {
        signal: controller.signal,
        onConversationReady: (id) => {
          activeTextConversationRef.current = id;
        }
      });
    } finally {
      if (textAbortControllerRef.current === controller) {
        textAbortControllerRef.current = null;
        activeTextConversationRef.current = null;
        setIsTextChatRunning(false);
      }
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    const textToSend = inputText;
    setInputText('');
    setSelectedImage(null);
    await sendTextMessage(textToSend);
  };

  const handleResend = async (text) => {
    await sendTextMessage(text);
  };

  const handleStopTextChat = () => {
    if (!isTextChatRunning && !textAbortControllerRef.current) return;

    textAbortControllerRef.current?.abort();
    appendAssistantMessage?.(STOPPED_RESPONSE_MESSAGE);

    if (activeTextConversationRef.current) {
      cancelChatResponse(activeTextConversationRef.current).catch(() => {});
    }

    textAbortControllerRef.current = null;
    activeTextConversationRef.current = null;
    setIsTextChatRunning(false);
  };

  const getTextSizeClass = () => {
    if (fontSize === 'small') return 'text-sm';
    if (fontSize === 'large') return 'text-lg';
    return 'text-base';
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
    voicePlaybackResolverRef.current?.();
    voicePlaybackResolverRef.current = null;
    audioSourceRef.current?.disconnect();
    audioSourceRef.current = null;
    window.speechSynthesis?.cancel();
    setVoiceState('idle');
  };

  const cancelVoiceSession = async () => {
    voiceCanceledRef.current = true;
    voiceAbortControllerRef.current?.abort();

    if (isRecording) {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }

    stopVoicePlayback();

    if (activeVoiceConversationRef.current && voiceState === 'thinking') {
      appendAssistantMessage?.(STOPPED_RESPONSE_MESSAGE);
      cancelChatResponse(activeVoiceConversationRef.current).catch(() => {});
    }

    setVoiceError('');
    setVoiceState('idle');
  };

  const playBoostedAudio = (audioUrl, gainValue = 1.8) => {
    return new Promise((resolve, reject) => {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audio = new Audio(audioUrl);
      audio.crossOrigin = 'anonymous';
      responseAudioRef.current = audio;

      if (!AudioContextClass) {
        audio.volume = 1;
        audio.onended = () => {
          voicePlaybackResolverRef.current = null;
          resolve();
        };
        audio.onerror = (event) => {
          voicePlaybackResolverRef.current = null;
          reject(event);
        };
        voicePlaybackResolverRef.current = resolve;
        audio.play().catch(reject);
        return;
      }

      const audioContext = audioContextRef.current || new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaElementSource(audio);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = gainValue;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      audioSourceRef.current = source;

      audio.onended = () => {
        source.disconnect();
        gainNode.disconnect();
        audioSourceRef.current = null;
        voicePlaybackResolverRef.current = null;
        resolve();
      };
      audio.onerror = (event) => {
        source.disconnect();
        gainNode.disconnect();
        audioSourceRef.current = null;
        voicePlaybackResolverRef.current = null;
        reject(event);
      };
      voicePlaybackResolverRef.current = resolve;

      audioContext.resume()
        .then(() => audio.play())
        .catch(reject);
    });
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

  const playAssistantVoice = async (text, targetConversationId) => {
    if (!text?.trim()) return;

    setVoiceState('speaking');
    try {
      const res = await textToSpeech(text, targetConversationId, {
        signal: voiceAbortControllerRef.current?.signal
      });
      if (!res?.audio_url) throw new Error('Không có audio_url');
      if (voiceCanceledRef.current) return;

      await playBoostedAudio(res.audio_url);
    } catch (error) {
      if (voiceCanceledRef.current || error.code === 'ERR_CANCELED' || error.name === 'CanceledError') return;
      await speakWithBrowser(text);
    } finally {
      responseAudioRef.current = null;
      if (!voiceCanceledRef.current) setVoiceState('idle');
    }
  };

  const stopRecording = ({ cancel = false } = {}) => {
    voiceCanceledRef.current = cancel;
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
      cancelVoiceSession();
      return;
    }

    if (voiceState === 'transcribing' || voiceState === 'thinking') {
      return;
    }

    try {
      setVoiceError('');
      voiceCanceledRef.current = false;
      activeVoiceConversationRef.current = null;
      voiceAbortControllerRef.current = new AbortController();
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

        if (voiceCanceledRef.current) {
          setVoiceState('idle');
          return;
        }

        try {
          setVoiceState('transcribing');
          const res = await speechToText(audioBlob, {
            signal: voiceAbortControllerRef.current?.signal
          });
          if (voiceCanceledRef.current) return;

          const text = res.text || res.data?.text; 
          if (text) {
             setInputText('');
             setVoiceState('thinking');
             const chatResult = await sendMessage(text, selectedModel, {
               signal: voiceAbortControllerRef.current?.signal,
               onConversationReady: (id) => {
                 activeVoiceConversationRef.current = id;
               }
             });
             if (voiceCanceledRef.current) return;

             const answer = chatResult?.response;
             if (answer && !answer.includes('Hết hạn mức')) {
               await playAssistantVoice(answer, chatResult.conversationId);
             } else {
               setVoiceState('idle');
             }
          } else {
            setVoiceError('Không nghe rõ nội dung. Vui lòng thử lại.');
            setVoiceState('idle');
          }
        } catch (err) {
          if (voiceCanceledRef.current || err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
            setVoiceState('idle');
            return;
          }
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
        <div className={`w-full text-sm py-2.5 px-4 rounded-t-2xl flex justify-between items-center mb-[-12px] shadow-sm z-0 pb-4 ${
          isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-slate-900 text-white'
        }`}>
          <span className="font-medium">Phiên này đã hết hạn sử dụng.</span>
          <button onClick={() => window.location.reload()} className="text-slate-300 hover:text-white underline text-xs font-semibold">
            Bắt đầu mới
          </button>
        </div>
      )}

      {(voiceState !== 'idle' || voiceError) && (
        <div className={`mb-3 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
          voiceError
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : isDarkMode
              ? 'border-white/10 bg-slate-900 text-slate-200'
              : 'border-sky-100 bg-white text-slate-700'
        }`}>
          <span className="font-medium">{getVoiceStatusText()}</span>
          <button
            type="button"
            onClick={cancelVoiceSession}
            className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              voiceError
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : isDarkMode
                  ? 'bg-white/10 text-slate-100 hover:bg-white/15'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Dừng
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSend} 
        className={`w-full flex flex-col rounded-3xl shadow-[0_18px_48px_rgba(15,92,150,0.10)] border p-2 z-10 transition-all duration-300 ${
          isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-sky-100'
        } ${isLimitReached ? 'opacity-80' : ''}`}
      >
        {selectedImage && (
          <div className={`mx-2 mt-2 flex items-center justify-between rounded-2xl border px-3 py-2 text-sm ${
            isDarkMode ? 'border-white/10 bg-white/5 text-slate-300' : 'border-sky-100 bg-sky-50 text-slate-600'
          }`}>
            <span className="truncate">Ảnh đã chọn: {selectedImage.name}</span>
            <button type="button" onClick={() => setSelectedImage(null)} className="ml-3 font-semibold text-rose-500 hover:text-rose-600">
              Xóa
            </button>
          </div>
        )}
        <input 
          type="text" 
          placeholder="Mô tả triệu chứng hoặc đặt câu hỏi sức khỏe..." 
          className={`flex-1 bg-transparent px-4 pt-3 pb-6 ${getTextSizeClass()} outline-none ${isLimitReached ? 'cursor-not-allowed text-slate-400' : isDarkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'}`} 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          disabled={isRecording || isLimitReached} 
        />
        
        {/* Hàng công cụ bên dưới đáy Form */}
        <div className="flex items-center justify-between px-1 pb-1">
          
          {/* Bên Trái: Các nút tiện ích (+, Mic) */}
          <div className="flex items-center gap-1">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={isLimitReached}/>
            <button type="button" onClick={handlePlusClick} disabled={isLimitReached} className={`p-2 transition rounded-2xl ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-slate-100' : 'text-slate-500 hover:bg-sky-50 hover:text-blue-700'}`} title="Đính kèm ảnh">
               <Paperclip size={20} />
            </button>
            {!inputText.trim() && !selectedImage && (
              <button type="button" onClick={handleVoiceClick} disabled={isLimitReached || voiceState === 'transcribing' || voiceState === 'thinking'} className={`p-2 transition rounded-full ${
                isRecording
                  ? 'text-rose-600 bg-rose-100 animate-pulse'
                  : voiceState === 'speaking'
                    ? 'text-blue-600 bg-blue-50'
                    : isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-slate-100' : 'text-slate-500 hover:bg-sky-50 hover:text-blue-700'
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
                 className={`appearance-none bg-transparent font-medium text-[13px] md:text-sm py-1.5 pl-3 pr-6 rounded-xl cursor-pointer outline-none transition ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-500 hover:bg-sky-50'}`}
               >
                 <option className={isDarkMode ? 'bg-[#111827] text-gray-100' : 'bg-white text-gray-800'} value="qwen">Mô hình Qwen</option>
                 <option className={isDarkMode ? 'bg-[#111827] text-gray-100' : 'bg-white text-gray-800'} value="gemini">Mô hình Gemini</option>
                 <option className={isDarkMode ? 'bg-[#111827] text-gray-100' : 'bg-white text-gray-800'} value="claude">Mô hình Claude</option>
               </select>
               <span className="absolute right-2 top-[10px] text-slate-400 pointer-events-none text-xs">▼</span>
            </div>

            <button 
              type={isTextChatRunning ? 'button' : 'submit'}
              onClick={isTextChatRunning ? handleStopTextChat : undefined}
              disabled={!isTextChatRunning && (isLimitReached || (!inputText.trim() && !selectedImage))}
              className={`w-9 h-9 flex items-center justify-center rounded-2xl transition duration-300 ${
                isTextChatRunning
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20'
                  : (!inputText.trim() && !selectedImage) || isLimitReached
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
              }`}
              title={isTextChatRunning ? 'Dừng phản hồi' : 'Gửi tin nhắn'}
              aria-label={isTextChatRunning ? 'Dừng phản hồi' : 'Gửi tin nhắn'}
            >
              {isTextChatRunning ? <Square size={15} fill="currentColor" /> : <IoSendSharp size={16} />}
            </button>
          </div>

        </div>
      </form>
      <div className={`text-center mt-2 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        Bác sĩ Ảo có thể mắc sai lầm. Vui lòng kiểm tra lại thông tin.
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full relative ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f5f9fc] text-slate-800'}`}>
      
      <header className={`md:hidden border-b p-4 flex items-center justify-between shadow-sm z-20 ${isDarkMode ? 'bg-[#111827] border-white/10 text-slate-100' : 'bg-white border-sky-100 text-slate-800'}`}>
        <h1 className="text-xl font-bold flex items-center gap-2"><Stethoscope size={22} className="text-blue-500" /> Bác sĩ Ảo</h1>
        <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2 rounded-2xl ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-sky-50'}`} aria-label="Mở menu">
          <Menu size={24} />
        </button>
      </header>

      {isNewChat && (
        <button
          type="button"
          onClick={() => navigate('/upgrade')}
          className={`absolute left-1/2 top-20 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium shadow-sm ring-1 transition md:top-5 ${
            isDarkMode ? 'bg-slate-900 text-slate-300 ring-white/10 hover:bg-white/10 hover:text-white' : 'bg-white text-slate-600 ring-sky-100 hover:bg-sky-50 hover:text-blue-700'
          }`}
        >
          <span>Gói miễn phí</span>
          <span className="text-gray-300">·</span>
          <span className="underline underline-offset-2">Nâng cấp</span>
        </button>
      )}

      {isNewChat ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
          <div className="mb-8 flex max-w-3xl flex-col items-center gap-4 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-3xl shadow-sm ${isDarkMode ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-blue-600'}`}>
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              {getGreeting()}
            </h1>
            <p className={`max-w-xl text-base leading-7 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Mô tả triệu chứng, đặt câu hỏi về sức khỏe hoặc dùng micro để bắt đầu trao đổi.
            </p>
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
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm font-semibold">
                <Bot size={20} />
              </div>
            )}

            {/* TIN NHẮN CỦA USER LÀM KIỂU MỚI BÊN TRÊN */}
            {msg.role === 'user' ? (
              <UserMessageBubble msg={msg} onResend={handleResend} isDarkMode={isDarkMode} textSizeClass={getTextSizeClass()} />
            ) : (
              /* TIN NHẮN CỦA AI */
              <div className="py-2 max-w-[85%] md:max-w-[85%] w-full">
                
                {msg.content && (
                   <ExpandableMarkdown content={msg.content} isStreaming={loading && msg.isNew} isDarkMode={isDarkMode} textSizeClass={getTextSizeClass()} />
                )}

                {/* CÁC THÀNH PHẦN PHỤ CỦA AI */}
                <div className="mt-3 flex flex-col gap-2">
                  
                  {msg.risk_level === 'high' && (
                     <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex gap-2 items-start shadow-sm mt-2">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rose-500"/>
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
      <div className={`p-4 md:p-6 w-full flex justify-center z-10 ${isDarkMode ? 'bg-gradient-to-t from-[#0f172a] to-transparent' : 'bg-gradient-to-t from-[#f5f9fc] to-transparent'}`}>
        {renderComposer()}
      </div>
      </>
      )}
    </div>
  );
};

export default ChatPage;
