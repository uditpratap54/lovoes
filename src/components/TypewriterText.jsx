import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TypewriterText({
  lines,
  className = '',
  speed = 50,
  onComplete,
  showCursor = true,
  lineDelay = 500,
  style,
}) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!lines || lines.length === 0) return;

    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      setDone(true);
      onComplete?.();
      return;
    }

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;
    setCurrentText('');

    const typeChar = () => {
      if (charIndex < currentLine.length) {
        setCurrentText(currentLine.slice(0, charIndex + 1));
        charIndex++;
        setTimeout(typeChar, speed + Math.random() * 20);
      } else {
        setTimeout(() => {
          setDisplayedLines((prev) => [...prev, currentLine]);
          setCurrentText('');
          setCurrentLineIndex((prev) => prev + 1);
        }, lineDelay);
      }
    };

    const timeout = setTimeout(typeChar, 100);
    return () => clearTimeout(timeout);
  }, [currentLineIndex]);

  const renderFormattedText = (text) => {
    if (!text) return <span className="block h-4" />;
    
    // Check if it's a list item
    const isListItem = text.startsWith('* ');
    const content = isListItem ? text.slice(2) : text;
    
    // Parse bold markdown **text**
    const parts = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;
    
    while ((match = boldRegex.exec(content)) !== null) {
      // Add text before bold match
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      // Add bolded text
      parts.push(
        <strong key={match.index} className="font-bold text-sky-300">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    if (isListItem) {
      return (
        <div className="flex items-start gap-2 my-1 pl-4 text-white/80">
          <span className="text-sky-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
          <span>{parts}</span>
        </div>
      );
    }
    
    return <div className="my-1">{parts}</div>;
  };

  return (
    <div className={className} style={style}>
      {displayedLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="leading-relaxed"
        >
          {renderFormattedText(line)}
        </motion.div>
      ))}
      {!done && (
        <div className="leading-relaxed">
          {renderFormattedText(currentText)}
          {showCursor && (
            <span
              className="inline-block w-0.5 h-4 bg-sky-400 ml-0.5 animate-cursor-blink"
              style={{ verticalAlign: 'middle' }}
            />
          )}
        </div>
      )}
    </div>
  );
}
