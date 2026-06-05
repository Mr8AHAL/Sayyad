'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
  children: ReactNode;
  menu: ReactNode;
}

export function ContextMenu({ children, menu }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    holdTimer.current = setTimeout(() => {
      setIsOpen(true);
      setPosition({ x: touch.clientX, y: touch.clientY });
    }, 600); // 600ms hold
  };

  const handleTouchEnd = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  return (
    <>
      <div 
        ref={containerRef}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        className="contents"
      >
        {children}
      </div>
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed z-50 min-w-[200px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl py-2 animate-in fade-in zoom-in-95 duration-100"
          style={{ 
             top: Math.min(position.y, window.innerHeight - 300), 
             left: Math.min(position.x, window.innerWidth - 250) 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {menu}
        </div>,
        document.body
      )}
    </>
  );
}
