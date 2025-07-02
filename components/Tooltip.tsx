
import React from 'react';

interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  content: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ visible, x, y, content }) => {
  if (!visible) return null;

  return (
    <div
      className="absolute bg-gray-900 border border-cyan-500 text-white text-sm rounded-lg shadow-xl p-3 pointer-events-none transition-opacity duration-200"
      style={{
        left: `${x + 15}px`,
        top: `${y}px`,
        opacity: 1,
        transform: 'translateY(-50%)',
      }}
    >
      {content}
    </div>
  );
};
