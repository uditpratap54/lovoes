import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <div className={className} style={style}>
      {displayedLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="leading-relaxed"
        >
          {line}
        </motion.div>
      ))}
      {!done && (
        <div className="leading-relaxed">
          {currentText}
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
