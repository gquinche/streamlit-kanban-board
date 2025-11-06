import streamlit.components.v1 as components
import os

__version__ = "0.2.0-dev"

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component(
        "kanban_board",
        url="http://192.168.1.3:5173", # this is my pc port which allows me to test on mobile
        # url = "http://localhost:5173" #this is the local port inside docker however outside it's getting remapped
        # and it seems the connecting command is run outside where the javascript runs and not inside in the python server?
        # url = "http://localhost:7031"  # thus a custom port is sometimes needed
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "src/frontend/build")
    _component_func = components.declare_component("kanban_board", path=build_dir)

def kanban_board(columns,
                 horizontal_alignment: str = 'left',
                 vertical_alignment: str = 'top',
                 horizontal: bool = False,
                 gap: str = 'medium',
                 width: str | int = 'stretch',
                 height: str | int = 'stretch',
                 border: bool = False,
                 min_width: str | int | None = None,
                 min_height: str | int | None = None,
                 stacked: bool = False,
                 main_column_min_width: str | int | None = None,
                 main_column_min_height: str | int | None = None,
                 debug_font: bool = False,
                 allow_new_categories: bool = False,
                 rename_categories: str = 'none', # 'none', 'new_only', 'all'
                 new_category_title: str = 'New Category',
                 key=None,
                 ):
    """Create a kanban board component.

    Parameters
    ----------
    columns: list
        List of dictionaries containing column data. Each dictionary should have:
        - 'title': str - The column title
        - 'cards': list - List of card dictionaries with 'id', 'title', and optional 'help'
        - 'is_main_column': bool (optional) - Whether this column should use main column min dimensions
    horizontal_alignment: 'left' | 'center' | 'right' | 'distribute'
        Horizontal alignment of the board. Default is 'left'.
    vertical_alignment: 'top' | 'center' | 'bottom' | 'distribute'
        Vertical alignment of the board. Default is 'top'.
    horizontal: bool
        Whether to layout columns horizontally or vertically. Default is False.
    gap: 'small' | 'medium' | 'large'
        Gap between items in the board. Default is 'medium'.
    width: 'stretch' | number
        Width of the board container. Default is 'stretch'.
    height: 'content' | 'stretch' | number
        Height of the board container. Default is 'content'.
    border: bool
        Whether to show a border around the board. Default is False.
    min_width: str | int | None
        Minimum width of the board columns. Default is None.
    min_height: str | int | None
        Minimum height of the board columns. Default is None.
    stacked: bool
        Whether to stack cards in columns. Default is False.
    main_column_min_width: str | int | None
        Minimum width for columns marked as main columns. Can be 'stretch' to fill container width, or a number for pixel width. Default is None.
    main_column_min_height: str | int | None
        Minimum height for columns marked as main columns. Can be 'stretch' to fill container height, or a number for pixel height. Default is None.
    debug_font: bool
        Whether to show the font loading debug window. Default is False.
    allow_new_categories: bool
        Whether to show a pseudo-transparent category that creates new categories on drop. Default is False.
    rename_categories: str
        Controls category renaming behavior:
        - 'none': No renaming allowed
        - 'new_only': Only new categories can be renamed
        - 'all': All categories can be renamed
    new_category_title: str
        Default title for newly created categories. Default is 'New Category'.
    key: str or None
        Streamlit key for the component

    Returns
    -------
    dict
        The current state of the kanban board
    """
    return _component_func(
        columns=columns,
        horizontal_alignment=horizontal_alignment,
        vertical_alignment=vertical_alignment,
        horizontal=horizontal,
        gap=gap,
        width='stretch',
        height='500',
        border=border,
        minWidth=min_width,
        minHeight=min_height,
        key=key,
        stacked=stacked,
        mainColumnMinWidth=main_column_min_width,
        mainColumnMinHeight=main_column_min_height,
        allowNewCategories=allow_new_categories,
        renameCategories=rename_categories,
        newCategoryTitle=new_category_title,
        # debug_font=debug_font,
        # font_file_name='http://localhost:4117/app/static/trash.ttf'
    )
