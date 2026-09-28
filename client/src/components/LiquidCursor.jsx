import React, { useEffect, useState } from 'react';

const LiquidCursor = () => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [trail, setTrail] = useState(Array(5).fill({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrameId;
    let targetX = position.x;
    let targetY = position.y;
    let currentX = position.x;
    let currentY = position.y;
    const trails = Array(5).fill({ x: currentX, y: currentY });

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updateCursor = () => {
      // Lerp for main cursor
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      // Update trails
      let prevX = currentX;
      let prevY = currentY;

      for (let i = 0; i < trails.length; i++) {
        trails[i] = {
          x: trails[i].x + (prevX - trails[i].x) * 0.35,
          y: trails[i].y + (prevY - trails[i].y) * 0.35
        };
        prevX = trails[i].x;
        prevY = trails[i].y;
      }

      setPosition({ x: currentX, y: currentY });
      setTrail([...trails]);

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, .hover-target')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  // Hide cursor on mobile
  if (typeof window !== 'undefined' && window.innerWidth <= 768) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 rounded-full z-[9999] pointer-events-none mix-blend-screen transition-all duration-300"
        style={{
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
          width: isHovering ? '60px' : '20px',
          height: isHovering ? '60px' : '20px',
          background: isHovering ? 'rgba(249, 115, 22, 0.2)' : '#7c3aed',
          border: isHovering ? '1px solid #f97316' : 'none',
          boxShadow: isHovering ? '0 0 30px 10px rgba(249, 115, 22, 0.3)' : '0 0 20px 5px rgba(124, 58, 237, 0.4)'
        }}
      />
      {trail.map((t, i) => (
        <div
          key={i}
          className="fixed top-0 left-0 rounded-full bg-[#7c3aed]/60 pointer-events-none z-[9998]"
          style={{
            transform: `translate(-50%, -50%) translate(${t.x}px, ${t.y}px)`,
            width: `${10 - i}px`,
            height: `${10 - i}px`,
            opacity: 1 - i * 0.15
          }}
        />
      ))}
    </>
  );
};

export default LiquidCursor;
