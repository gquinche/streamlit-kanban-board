import React, { useState, useEffect, useMemo } from 'react';
import { Column } from './Column';
import { Streamlit, withStreamlitConnection } from 'streamlit-component-lib';
import { SimpleTooltip } from './SimpleTooltip';
import { BoardProps } from './types';

// Common font file extensions we want to support
const FONT_EXTS = [ "ttf","woff2", "woff", "otf"];

/**
 * A Kanban board component for Streamlit
 * 
 * This component allows users to:
 * - View cards organized in columns
 * - Drag and drop cards between columns
 * - Automatically sync state back to Streamlit
 * 
 * @param {BoardProps} props - The props passed from Streamlit
 */
const Board: React.FC<BoardProps> = ({ args, disabled, theme }) => {
  const [columns, setColumns] = useState(args.columns);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  
  // Parse font list - font_file_name takes priority over theme.font
  const fontList = args.font_file_name && args.font_file_name.trim() !== ''
    ? [args.font_file_name]
    : theme?.font
    ? theme.font.replace(/"/g, '').split(',').map(f => f.trim())
    : [];

  // Determine applied font family - use full font stack with fallbacks
  // const appliedFontFamily = fontUrl && fontList.length > 0
  //   ? fontList.map(f => `"${f}"`).join(', ') + ', "Source Sans", sans-serif'
  //   : (theme?.font || '"Source Sans", sans-serif');

  // this line goes through the font List and creates a string for css font-family 
  const appliedFontFamily = fontList.length > 0
    ? fontList.map(f => `"${f}"`).join(', ') 
    : (theme?.font );
  // Add these helper functions to convert Streamlit properties
  const getGapSize = (gap: string) => {
    switch(gap) {
      case 'small': return '0.5rem';
      case 'medium': return '1rem';
      case 'large': return '2rem';
      default: return '1rem'; // default if not specified
    }
  };

  const getVerticalAlignment = (alignment: string) => {
    switch(alignment) {
      case 'top': return 'flex-start';
      case 'center': return 'center';
      case 'bottom': return 'flex-end';
      case 'distribute': return 'space-between';
      default: return 'flex-start'; // default if not specified
    }
  };

  const getHorizontalAlignment = (alignment: string) => {
    switch(alignment) {
      case 'left': return 'left';
      case 'center': return 'center';
      case 'right': return 'right';
      case 'distribute': return 'space-between';
      default: return 'left'; // default if not specified
    }
  };

  const style = useMemo(() => ({
    background: theme?.backgroundColor || '#fff',
    color: theme?.textColor || '#000',
    padding: '1rem',
    fontFamily: appliedFontFamily,
    display: 'flex' as 'flex',
    flexDirection: args.horizontal ? 'row' as 'row' : 'column' as 'column',
    flexWrap: args.horizontal ? 'wrap' as 'wrap' : 'nowrap' as 'nowrap',
    gap: getGapSize(args.gap || 'medium'),
    justifyContent: getHorizontalAlignment(args.horizontal_alignment || 'left'),
    alignItems: getVerticalAlignment(args.vertical_alignment || 'top'),
    opacity: disabled ? 0.5 : 1,
    width: args.width === 'stretch' ? '100%' : args.width,
    overflowY: 'scroll' as 'scroll',
    border: args.border || false ? '1px solid #ddd' : 'none',
  }), [theme, disabled, args.gap, args.horizontal_alignment, args.vertical_alignment, args.width, args.height, args.horizontal, fontUrl, fontList, appliedFontFamily]);

  // Update is_main_column property when args.columns changes, but preserve local card state
  useEffect(() => {
    setColumns(prevColumns => {
      return prevColumns.map((prevColumn, index) => {
        const newColumn = args.columns[index];
        if (newColumn) {
          return {
            ...prevColumn,
            is_main_column: newColumn.is_main_column
          };
        }
        return prevColumn;
      });
    });
  }, [args.columns]);

  // Update frame height when columns change
  useEffect(() => {
    Streamlit.setFrameHeight();
  }, [columns, args]);

  // Notify Streamlit of the current board state
  useEffect(() => {
    Streamlit.setComponentValue({ columns });
  }, [columns]);

  // Simple font loading - assume font name is correct and load from /app/static
  useEffect(() => {
    if (fontList.length === 0) {
      setFontUrl(null);
      return;
    }

    // Get app base URL
    const getAppBaseUrl = () => {
      try {
        if (window.parent && window.parent.location) {
          return window.parent.location.origin;
        }
      } catch (e) {
        // CORS might block this
      }
      return window.location.origin.replace(':5173', ':9268');
    };

    const appBaseUrl = getAppBaseUrl();

    // Generate simple CSS for fonts
    let fontCss = '';
    for (const fontName of fontList) {
      // Check if font name already has extension
      const hasExtension = /\.(ttf|woff|woff2|otf)$/i.test(fontName);
      const fontFileName = hasExtension ? fontName : `${fontName.replace(/\s+/g, '')}.ttf`;
      const fontUrl = `${appBaseUrl}/app/static/${fontFileName}`;

      fontCss += `
@font-face {
  font-family: "${fontName}";
  src: url("${fontUrl}");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
`;
    }

    // Inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = fontCss;
    document.head.appendChild(styleElement);

    // Set font URL for debug
    if (fontList.length > 0) {
      const firstFont = fontList[0];
      const hasExtension = /\.(ttf|woff|woff2|otf)$/i.test(firstFont);
      const fontFileName = hasExtension ? firstFont : `${firstFont.replace(/\s+/g, '')}.ttf`;
      setFontUrl(`${appBaseUrl}/app/static/${fontFileName}`);
    }

    return () => {
      if (styleElement.parentNode) {
        document.head.removeChild(styleElement);
      }
    };
  }, [fontList]);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    if (disabled) return;
    setDraggedCardId(cardId);
  };

  // Handle column title changes
  const handleTitleChange = (oldTitle: string, newTitle: string, columnIndex: number) => {
    setColumns(prevColumns => {
      // Check if title already exists (for warning purposes only, not prohibition)
      const isDuplicate = prevColumns.some((col, idx) => 
        idx !== columnIndex && col.title === newTitle
      );

      if (isDuplicate) {
        console.warn(`Warning: Column title "${newTitle}" already exists. Duplicate titles are allowed but may lead to confusion.`);
        // Do not return here; proceed with the update
      }

      return prevColumns.map((column, idx) => {
        // Only update the column at the specific index
        if (idx === columnIndex) {
          return {
            ...column,
            title: newTitle
          };
        }
        return column;
      });
    });
  };

  // Add pseudo-transparent column if allowed
  const displayColumns = args.allowNewCategories 
    ? [...columns, { 
        title: args.newCategoryTitle || 'New Category',
        cards: [],
        isPseudoColumn: true 
      }] 
    : columns;

  // Add this helper function at the top of the component
  const getUniqueColumnTitle = (baseTitle: string, existingColumns: Array<{title: string}>) => {
    let counter = 1;
    let newTitle = baseTitle;
    
    while (existingColumns.some(col => col.title === newTitle)) {
      counter++;
      newTitle = `${baseTitle} ${counter}`;
    }
    
    return newTitle;
  };

  const handleDrop = (e: React.DragEvent, targetColumnTitle: string, isTargetPseudoColumn: boolean) => {
    e.preventDefault();
    if (disabled || !draggedCardId) return;

    setColumns(prevColumns => {
      // Find the source column and card
      const sourceColumnIndex = prevColumns.findIndex(col => 
        col.cards.some(card => card.id === draggedCardId)
      );
      
      if (sourceColumnIndex === -1) return prevColumns;
      
      const sourceColumn = prevColumns[sourceColumnIndex];
      const cardIndex = sourceColumn.cards.findIndex(c => c.id === draggedCardId);
      const movedCard = sourceColumn.cards[cardIndex];

      // Create a deep copy of the columns array
      let updatedColumns = prevColumns.map(col => ({
        ...col,
        cards: [...col.cards]
      }));

      // Remove card from source
      updatedColumns[sourceColumnIndex].cards = 
        updatedColumns[sourceColumnIndex].cards.filter(c => c.id !== draggedCardId);

      // Handle dropping in pseudo column using the flag
      if (isTargetPseudoColumn) { // Use the boolean flag here
        const newColumnTitle = getUniqueColumnTitle(
          args.newCategoryTitle || 'New Category',
          updatedColumns
        );
        
        // Add the new column with the card
        updatedColumns.push({
          title: newColumnTitle,
          cards: [movedCard],
          isNewColumn: true
        });
      } else {
        // Find target column and add card
        const targetColumnIndex = updatedColumns.findIndex(col => col.title === targetColumnTitle); // Use targetColumnTitle for existing columns
        if (targetColumnIndex !== -1) {
          const targetCards = [...updatedColumns[targetColumnIndex].cards];
          if (args.stacked) {
            targetCards.unshift(movedCard); // Add to top if stacked
          } else {
            targetCards.push(movedCard); // Add to bottom if not stacked
          }
          updatedColumns[targetColumnIndex].cards = targetCards;
        }
      }

      return updatedColumns;
    });

    setDraggedCardId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  return (
    <div className="board stMarkdown" style={style}>
      
      {/* Debug message for theme font */}
      {args.debug_font && (
        <div style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#333',
          border: '1px solid #ccc',
          zIndex: 1000,
          maxWidth: '320px',
          maxHeight: '400px',
          overflowY: 'auto',
          wordWrap: 'break-word',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div><strong>🎨 Font Debug</strong></div>
          <div>Theme font: <code>{theme?.font || 'undefined'}</code></div>
          <div>Font file name passed: <code>{args.font_file_name || 'N/A'}</code></div>
          <div>Custom font loaded: <code>{fontUrl ? 'Yes' : 'No'}</code></div>
          <div>Font URL: <code>{fontUrl || 'N/A'}</code></div>
          <div>Applied CSS: <code>{appliedFontFamily}</code></div>
          <div>Font List: <code>{fontList.join(', ') || 'N/A'}</code></div>
          <div style={{fontSize: '9px', marginTop: '4px', color: '#666'}}>
            Fonts loaded from: <code>/app/static/*</code>
          </div>
        </div>
      )}
      {displayColumns.map((column, index) => (
        <Column
          key={`${column.title}-${index}`}
          title={column.title}
          cards={column.cards}
          onDragStart={handleDragStart}
          onDrop={(e, title, isPseudo) => handleDrop(e, title, isPseudo)} // Pass title and isPseudo flag
          onDragOver={handleDragOver}
          onTitleChange={(oldTitle, newTitle) => handleTitleChange(oldTitle, newTitle, index)}
          disabled={disabled}
          theme={theme}
          minWidth={args.minWidth}
          minHeight={args.minHeight}
          stacked={args.stacked}
          isMainColumn={column.is_main_column}
          mainColumnMinWidth={column.is_main_column ? (args.mainColumnMinWidth === 'stretch' ? '90%' : args.mainColumnMinWidth) : undefined}
          mainColumnMinHeight={column.is_main_column ? (args.mainColumnMinHeight === 'stretch' ? '90%' : args.mainColumnMinHeight) : undefined}
          isPseudoColumn={column.isPseudoColumn}
          isNewColumn={column.isNewColumn}
          allowRename={args.renameCategories === 'all' || 
            (args.renameCategories === 'new_only' && column.isNewColumn)}
        />
      ))}
    </div>
  );
};

export default withStreamlitConnection(Board);
