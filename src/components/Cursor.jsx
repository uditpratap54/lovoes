import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let animId;

    const handleMouseMove = (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
    };

    const handleMouseDown = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
      ring.style.transform = 'translate(-50%, -50%) scale(0.7)';
    };

    const handleMouseUp = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    const handleMouseEnterButton = () => {
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'rgba(249, 168, 212, 0.8)';
      dot.style.background = '#f9a8d4';
    };

    const handleMouseLeaveButton = () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(56, 189, 248, 0.6)';
      dot.style.background = '#38bdf8';
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;

      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    };

    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const buttons = document.querySelectorAll('button, a, [role="button"]');
    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', handleMouseEnterButton);
      btn.addEventListener('mouseleave', handleMouseLeaveButton);
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
