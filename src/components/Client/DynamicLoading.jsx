import { useState, useEffect } from 'react';

const DynamicLoading = () => {
  const loadingTexts = [
    "Đang phân tích triệu chứng...",
    "Đang tra cứu cơ sở dữ liệu y khoa...",
    "Đang tổng hợp phác đồ phù hợp...",
    "Vui lòng chờ trong giây lát...",
    "Bác sĩ Ảo đang suy nghĩ...",
    "Sắp xong rồi, cảm ơn bạn đã đợi..."
  ];

  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Cứ mỗi 2.5 giây sẽ đổi text 1 lần
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
        AI
      </div>
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-4">
        {/* Cụm 3 dấu chấm nhảy nhảy */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        {/* Dòng chữ thay đổi (có hiệu ứng mờ dần khi đổi) */}
        <span 
          key={textIndex} // Mẹo của React: Đổi key sẽ trigger lại animation
          className="text-[15px] font-medium text-gray-500 animate-in fade-in duration-500 italic"
        >
          {loadingTexts[textIndex]}
        </span>
      </div>
    </div>
  );
};

export default DynamicLoading;