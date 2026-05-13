import { useState, useEffect, useRef } from 'react';

const SmoothTyping = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const textRef = useRef(text);

  // 1. Luôn cập nhật kho chữ mới nhất mà không làm Reset cái đồng hồ gõ
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // 2. Đồng hồ gõ chạy ĐỘC LẬP (Chỉ Mount 1 lần duy nhất)
  useEffect(() => {
    const interval = setInterval(() => {
      // Dùng textRef thay vì text
      if (indexRef.current < textRef.current.length) {
        setDisplayedText(prev => prev + textRef.current[indexRef.current]);
        indexRef.current++;
      }
    }, 15); // Tốc độ gõ: 15 mili-giây / 1 ký tự

    return () => clearInterval(interval);
  }, []); // <-- Cực kỳ quan trọng: Array rỗng [] giúp interval không bao giờ bị chết giữa chừng

  return <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{displayedText}</p>;
};

export default SmoothTyping