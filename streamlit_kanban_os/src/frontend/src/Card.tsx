import React from 'react';
import { SimpleTooltip } from './SimpleTooltip';
import { CardProps } from './types';

export const Card: React.FC<CardProps> = ({ 
  id, 
  title, 
  help, 
  onDragStart, 
  disabled, 
  theme,
  stacked,
  index,
  style
}) => {
  const cardStyle = {
    background: theme?.lightenedBg05 || '#ffffff',
    color: theme?.textColor || '#31333F',
    padding: '0.75rem',
    marginBottom: stacked ? '0.1rem' : '0.5rem', // Decreased margin for stacked cards
    borderRadius: '4px',
    // border: `1px solid ${theme?.fadedText05 || 'rgba(49, 51, 63, 0.1)'}`,
    boxShadow: `0 2px 4px ${theme?.darkenedBgMix25 || 'rgba(255, 72, 0, 0.15)'}`,
    cursor: disabled ? 'not-allowed' : 'grab',
    transition: 'all 0.2s ease',
    display: 'flex' as 'flex',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    position: stacked ? 'absolute' as 'absolute' : 'static' as 'static',
    width: stacked ? 'calc(100% - 2rem)' : 'auto',
    maxWidth: stacked ? 'none' : '300px', // Max width for non-stacked cards
    top: stacked ? `${index! * 16}px` : 'auto',
    bottom: stacked ? '4rem' : 'auto',
    // left: stacked ? '1rem' : 'auto',
    zIndex: stacked ? 100 - index! : 'auto',
    ...style, // Apply passed in style
    ':hover': {
      boxShadow: `0 2px 4px ${theme?.darkenedBgMix25 || 'rgba(151, 166, 195, 0.25)'}`,
      borderColor: theme?.primaryColor || '#ff4b4b',
    }
  };

  return (
    <div
      style={cardStyle}
      draggable={!disabled}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
        onDragStart(e, id);
      }}
    >
      {/* add a subtle :: to hint this is dragable */}

      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1
      }}>
        {title}
      </span>
      {help && <SimpleTooltip content={help} theme={theme} />}
    </div>
  );
};
