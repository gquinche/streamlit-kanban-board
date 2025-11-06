import React from 'react';
import { ComponentProps } from 'streamlit-component-lib';

// Centralized type definitions for the Kanban board components

export interface CardData {
  id: string;
  title: string;
  help?: string;
}

export interface ColumnData {
  title: string;
  cards: CardData[];
  is_main_column?: boolean;
  isPseudoColumn?: boolean;
  isNewColumn?: boolean;
}

export interface BoardArgs {
  horizontal_alignment: 'left' | 'center' | 'right' | 'distribute';
  vertical_alignment: 'top' | 'center' | 'bottom' | 'distribute';
  horizontal: boolean;
  gap: 'small' | 'medium' | 'large';
  width: 'stretch' | number;
  height: 'content' | 'stretch' | number;
  border: boolean;
  columns: ColumnData[];
  minWidth?: string | number;
  minHeight?: string | number;
  stacked?: boolean;
  mainColumnMinWidth?: string | number;
  mainColumnMinHeight?: string | number;
  debug_font?: boolean;
  font_file_name?: string;
  allowNewCategories?: boolean;
  renameCategories?: 'none' | 'new_only' | 'all';
  newCategoryTitle?: string;
}

export interface BoardProps extends ComponentProps {
  args: BoardArgs;
  disabled: boolean;
}

export interface ColumnProps {
  title: string;
  cards: CardData[];
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDrop: (e: React.DragEvent, targetColumnTitle: string, isTargetPseudoColumn: boolean) => void; // Updated signature
  onDragOver: (e: React.DragEvent) => void;
  onTitleChange?: (oldTitle: string, newTitle: string) => void;
  disabled?: boolean;
  theme?: any;
  minWidth?: string | number;
  minHeight?: string | number;
  stacked: boolean | undefined;
  isMainColumn?: boolean;
  mainColumnMinWidth?: string | number;
  mainColumnMinHeight?: string | number;
  isPseudoColumn?: boolean;
  isNewColumn?: boolean;
  allowRename?: boolean;
}

export interface CardProps {
  id: string;
  title: string;
  help?: string;
  onDragStart: (e: React.DragEvent, id: string) => void;
  disabled?: boolean;
  theme?: any;
  stacked?: boolean;
  index?: number;
  style?: React.CSSProperties;
}

export interface SimpleTooltipProps {
  content: string;
  theme?: any;
}
