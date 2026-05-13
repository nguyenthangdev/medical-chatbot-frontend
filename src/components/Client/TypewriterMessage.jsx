/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

const TypewriterMessage = ({ text, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset khi text thay đổi
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [text, currentIndex, speed]);

  return <p className="whitespace-pre-wrap">{displayedText}</p>;
};

export default TypewriterMessage;