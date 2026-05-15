import { useState, useEffect } from 'react';

const DynamicLoading = ({ mode = 'thinking', isDarkMode = false }) => {
  const thinkingTexts = [
    "Đang phân tích triệu chứng...",
    "Đang tra cứu cơ sở dữ liệu y khoa...",
    "Đang tổng hợp thông tin phù hợp...",
    "Vui lòng chờ trong giây lát...",
    "Bác sĩ Ảo đang suy nghĩ...",
    "Sắp xong rồi, cảm ơn bạn đã đợi..."
  ];
  const loadingTexts = mode === 'conversation'
    ? ["Đang tải đoạn chat..."]
    : thinkingTexts;

  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Cứ mỗi 2.5 giây sẽ đổi text 1 lần
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500); 

    return () => clearInterval(interval);
  }, [loadingTexts.length]);

  return (
    <div className="flex gap-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm font-semibold">
        AI
      </div>
      
      <div className={`p-4 rounded-2xl border shadow-sm rounded-tl-none flex items-center gap-4 ${
        isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-sky-100'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        <span 
          key={textIndex} 
          className={`text-[15px] font-medium animate-in fade-in duration-500 italic ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
        >
          {loadingTexts[textIndex]}
        </span>
      </div>
    </div>
  );
};

export default DynamicLoading;
