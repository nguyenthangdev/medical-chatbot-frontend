import { useState, useEffect } from 'react';

const TypewriterMessage = ({ text, speed = 15 }) => {
  const [typing, setTyping] = useState({ source: text, displayedText: '', currentIndex: 0 });

  const isNewText = typing.source !== text;
  const displayedText = isNewText ? '' : typing.displayedText;
  const currentIndex = isNewText ? 0 : typing.currentIndex;

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setTyping({
          source: text,
          displayedText: displayedText + text[currentIndex],
          currentIndex: currentIndex + 1
        });
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [text, displayedText, currentIndex, speed]);

  return <p className="whitespace-pre-wrap">{displayedText}</p>;
};

export default TypewriterMessage;
