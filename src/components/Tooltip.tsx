// components/Tooltip.tsx
import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8; // 8px buffer
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + 8; // 8px buffer
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - 8; // 8px buffer
          break;
        case 'right':
          top = triggerRect.right + 8; // 8px buffer
          left = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          break;
        default:
          break;
      }
      
      // Ensure tooltip stays within viewport (basic check)
      if (top < 0) top = 0;
      if (left < 0) left = 0;
      if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width;


      setTooltipStyle({
        top: `${top + window.scrollY}px`, // Account for scroll position
        left: `${left + window.scrollX}px`, // Account for scroll position
      });
    }
  }, [isVisible, position]);


  return (
    <span
      className="relative inline-block" // Essential for positioning the tooltip relative to this trigger
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      ref={triggerRef}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-50 p-2 text-xs rounded-md shadow-lg
            bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900
            opacity-0 transition-opacity duration-200 pointer-events-none
            ${isVisible ? 'opacity-100' : ''}
          `}
          style={tooltipStyle}
        >
          {content}
        </div>
      )}
    </span>
  );
};

export default Tooltip;