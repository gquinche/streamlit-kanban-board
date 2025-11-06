import React, { useState } from 'react';
import { Card } from './Card';
import { ColumnProps, CardData } from './types';
import { Edit } from 'react-feather'; // Import the Edit icon

export const Column: React.FC<ColumnProps> = ({ 
  title, 
  cards, 
  onDragStart, 
  onDrop, 
  onDragOver, 
  disabled, 
  theme,
  minWidth,
  minHeight,
  stacked,
  isMainColumn,
  mainColumnMinHeight,
  mainColumnMinWidth,
  onTitleChange,
  isPseudoColumn,
  isNewColumn,
  allowRename 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const getColumnStyle = (props: { stacked: boolean | undefined, isMainColumn: boolean | undefined, mainColumnMinWidth: string | number | undefined, mainColumnMinHeight: string | number | undefined }) => {
    const { stacked, isMainColumn, mainColumnMinWidth, mainColumnMinHeight } = props;

    const baseStyle = {
      background: theme?.secondaryBackgroundColor || '#f0f2f6',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: `0 1px 3px ${theme?.darkenedBgMix15 || 'rgba(151, 166, 195, 0.15)'}`,
      ...(minWidth ? { minWidth } : {}),
      ...(minHeight ? { minHeight } : {}),
      ...(isMainColumn && mainColumnMinWidth ? { minWidth: mainColumnMinWidth } : {}),
      ...(isMainColumn && mainColumnMinHeight ? { minHeight: mainColumnMinHeight } : {}),
      maxWidth: '400px', // Max width for columns
    };

    if (stacked) {
      return {
        ...baseStyle,
        position: 'relative' as 'relative',
        overflow: 'visible' as 'visible', // needed because stacked cards use absolute positioning
        top: '0rem',
        // Only set minWidth if not already set by props or main column settings
        ...(baseStyle.minWidth ? {} : { minWidth: '200px' }), // Ensure minimum width for stacked columns
        // top margin reduction
        // marginTop: '-1rem',
      };
    }

    return baseStyle;
  };
  // a function to make more transparent a box background
  const makeBackgroundTransparent = (color: string, opacity: number) => {
    // Handle RGB/RGBA format
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbaMatch) {
      const [_, r, g, b] = rgbaMatch;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Handle HEX format
    const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      const [_, r, g, b] = hexMatch;
      const rgb = {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16)
      };
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    // If color format is not recognized, return with default opacity
    console.warn(`Unrecognized color format: ${color}`);
    return `${color.split(')')[0]}, ${opacity})`;
  };
  const columnStyle = {
    ...getColumnStyle({ stacked, isMainColumn, mainColumnMinWidth, mainColumnMinHeight }),
    ...(isPseudoColumn && {
      border: '2px dashed rgba(49, 51, 63, 0.8)',
      background: makeBackgroundTransparent(theme?.secondaryBackgroundColor || '#f0f2f6', 0.2),
      backdropFilter: 'blur(2px)',
    })
  };

  const titleStyle = {
    color: theme?.textColor || '#31333F',
    fontSize: stacked ? '0.9em' : '1.1em',
    fontWeight: 600,
    marginBottom: stacked ? '0.5rem' : '1rem',
    padding: stacked ? '0.2rem 0.5rem' : '0.5rem',
    borderBottom: stacked ? 'none' : `2px solid ${theme?.fadedText10 || 'rgba(49, 51, 63, 0.2)'}`,
    marginTop: stacked ? '0rem' : '0rem',
    // textAlign is removed here as flexbox's justifyContent will handle alignment
  };

  const getCardOpacity = (index: number) => {
    // Use a logarithmic scale to reduce opacity with depth
    if (index < 3) return 1
    const maxOpacity = 1;
    const minOpacity = 0;
    const depthFactor = Math.log(index + 1); // Using log to slow down the opacity reduction
    
    return Math.min(maxOpacity, Math.max(minOpacity, 1 - (depthFactor * 0.6)));
  };

  const handleTitleClick = () => {
    if (allowRename) {
      setIsEditing(true);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (editedTitle !== title) {
      // Notify parent of title change only if onTitleChange is provided
      if (onTitleChange) { // Add this check
        
        onTitleChange(title, editedTitle);
      }
      else {
        console.warn("onTitleChange handler is not provided.");
      }
    }
  };

  return (
    <div
      style={columnStyle}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, title, !!isPseudoColumn); // Pass title and isPseudoColumn flag
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {isEditing ? (
        <input
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          autoFocus
          style={{
            ...titleStyle,
            border: 'none',
            background: 'transparent',
            width: '100%'
          }}
        />
      ) : (
        <h3 
          style={{
            ...titleStyle,
            cursor: allowRename ? 'pointer' : 'default',
            display: 'flex', // Make h3 a flex container
            alignItems: 'center', // Vertically center items
            justifyContent: stacked ? 'center' : 'flex-start', // Align based on stacked prop
          }}
          onClick={handleTitleClick}
        >
          {editedTitle}
          {allowRename && (
            <Edit 
              size={16} // Adjust size as needed
              style={{ 
                marginLeft: '0.5rem', // Space between title and icon
                color: theme?.fadedText10 || 'rgba(49, 51, 63, 0.5)', // Icon color
                flexShrink: 0, // Prevent icon from shrinking
              }} 
            />
          )}
        </h3>
      )}
      <div style={{
        position: 'relative',
        minHeight: stacked ? `${Math.min(cards.length, 2) * 30 + 20}px` : 'auto',
        display: stacked ? 'block' : 'flex',
        flexWrap: stacked ? 'nowrap' : 'wrap',
        gap: stacked ? '0' : '0.5rem'
      }}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            help={card.help}
            stacked={stacked}
            onDragStart={(e) => onDragStart(e, card.id)}
            disabled={disabled}
            theme={theme}
            index={index}
            style={{
              ...(!stacked ? {} : {
                display: index >= 6 ? 'none' : 'flex',
                opacity: getCardOpacity(index)
              })
            }}
          />
        ))}
      </div>
    </div>
  );
};
