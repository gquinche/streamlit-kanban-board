import React, { useState } from "react";
import { HelpCircle } from "react-feather";
import { SimpleTooltipProps } from "./types";

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ content, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  const tooltipContainerStyle = {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '0.5rem',
    cursor: 'help',
  };

  const tooltipContentStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '110%', // Position to the right of the icon
    transform: 'translateY(-50%)',
    background: theme?.lightenedBg05 || '#ffffff',
    color: theme?.textColor || '#31333F',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'auto' as const, // Allow interactions
    opacity: isHovered ? 1 : 0,
    visibility: (isHovered ? "visible" : "hidden") as "visible" | "hidden",
    transition: 'opacity 0.2s, visibility 0.2s',
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme?.fadedText05 || 'rgba(49, 51, 63, 0.1)'}`,
    marginLeft: '0.5rem',
  };

  return (
    <div
      style={tooltipContainerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HelpCircle size={14} color={theme?.fadedText10 || '#2041ffff'} />
      <div style={tooltipContentStyle}>
        {content} 
        {/* TODO ALLOW USER TO SELECT TEXT OR OPEN HYPERLINKS HERE */}
      </div>
    </div>
  );
};
