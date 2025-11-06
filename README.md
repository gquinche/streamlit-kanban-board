# Streamlit Kanban OS

[![PyPI version](https://badge.fury.io/py/streamlit-kanban-os.svg)](https://pypi.org/project/streamlit-kanban-os/)
[![Python versions](https://img.shields.io/pypi/pyversions/streamlit-kanban-os.svg)](https://pypi.org/project/streamlit-kanban-os/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An advanced, interactive Kanban board component for Streamlit applications with main column support, responsive design, and customizable layouts.

## 🚀 Features

- **Drag & Drop**: Intuitive card movement between columns
- **Main Column Support**: Special columns with custom dimensions
- **Responsive Design**: Adapts to different screen sizes
- **Stacked Mode**: Compact card stacking for dense layouts
- **Customizable**: Extensive styling and layout options
- **TypeScript**: Fully typed for better development experience

## 🎯 Quick Start

You can test the component live at: [https://gquinche-streamlit-kanban-boa-streamlit-kanban-osexample-p5sn1l.streamlit.app/](https://gquinche-streamlit-kanban-boa-streamlit-kanban-osexample-p5sn1l.streamlit.app/)

```python
import streamlit as st
from streamlit_kanban_os import kanban_board

# Define your columns and cards
columns = [
    {
        "title": "To Do",
        "cards": [
            {"id": "1", "title": "Task 1", "help": "This is a sample task"},
            {"id": "2", "title": "Task 2"}
        ]
    },
    {
        "title": "In Progress",
        "cards": []
    },
    {
        "title": "Done",
        "cards": [],
        "is_main_column": True  # Mark as main column
    }
]

# Render the kanban board
board_state = kanban_board(
    columns,
    main_column_min_width="400px",  # Custom width for main columns
    main_column_min_height="300px"  # Custom height for main columns
)

st.write("Current board state:", board_state)
```

## 📚 API Reference

### `kanban_board(columns, **kwargs)`

#### Parameters

- **columns** (list): List of column dictionaries with the following structure:
  ```python
  {
      "title": str,           # Column title
      "cards": list,          # List of card dictionaries
      "is_main_column": bool  # Optional: Mark as main column (default: False)
  }
  ```

- **Main Column Options**:
  - `main_column_min_width` (str|int): Minimum width for main columns
  - `main_column_min_height` (str|int): Minimum height for main columns

- **Layout Options**:
  - `horizontal_alignment` (str): 'left', 'center', 'right', 'distribute'
  - `vertical_alignment` (str): 'top', 'center', 'bottom', 'distribute'
  - `horizontal` (bool): Layout columns horizontally
  - `gap` (str): 'small', 'medium', 'large'

- **Styling Options**:
  - `width` (str|int): Board width ('stretch' or pixel value)
  - `height` (str|int): Board height ('content', 'stretch' or pixel value)
  - `border` (bool): Show border around board
  - `stacked` (bool): Use stacked card layout

- **Column Styling**:
  - `min_width` (str|int): Minimum width for all columns
  - `min_height` (str|int): Minimum height for all columns

#### Returns

- **dict**: Current state of the kanban board with updated column and card positions

## 🎨 Advanced Usage

### Main Columns

Mark specific columns as "main columns" to give them special dimensions:

```python
columns = [
    {"title": "Backlog", "cards": [...], "is_main_column": False},
    {"title": "In Progress", "cards": [...], "is_main_column": True},  # Main column
    {"title": "Done", "cards": [...], "is_main_column": False}
]

kanban_board(
    columns,
    main_column_min_width="500px",
    main_column_min_height="400px"
)
```

### Responsive Layout

```python
kanban_board(
    columns,
    horizontal=True,  # Horizontal layout
    gap="large",      # More spacing
    width="stretch",  # Full width
    stacked=True      # Compact stacking
)
```

### Custom Styling

```python
kanban_board(
    columns,
    min_width="200px",    # Minimum column width
    min_height="150px",   # Minimum column height
    border=True,          # Show border
    gap="medium"          # Spacing between columns
)
```

## 🔧 Development

### Prerequisites

- Python 3.8+
- Node.js 16+
- Poetry (for development)

### Setup

```bash
# Clone the repository
git clone https://github.com/gabrielquinche/streamlit-kanban-os.git
cd streamlit-kanban-os

# Install Python dependencies
poetry install

# Install frontend dependencies
cd streamlit_kanban_os/src/frontend
npm install

# Test the frontend in case you want to modify it (Change deploy flag in init python file)
npm run start
# Build the frontend
npm run build
```

### Building for Distribution

```bash
# Build the package
poetry build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/gabrielquinche/streamlit-kanban-os/issues) page
2. Create a new issue with detailed information
3. Include code examples and error messages when possible

## 🙏 Acknowledgments

- Built with [Streamlit](https://streamlit.io/)
- Frontend powered by [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Using the ? symbol and pen to follow streamlit theming from [React Feather](https://react-feather.dev/)
