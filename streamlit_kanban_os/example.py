import streamlit as st
from streamlit_kanban_os import kanban_board

task_examples = 3

# Default options for multiselects
default_titles = ["To Do", "In Progress", "Done",'1','2','3','5','53']
# print hello world

default_cards = [f"Task {i}" for i in range(1, task_examples + 1)]

# Customize board
titles = st.multiselect(
    "Select column titles to display:",
    accept_new_options=True,
    options=["To Do", "In Progress", "Done",'1','2','3','5','53']+["To Do", "In Progress", "Done", "Review", "Blocked"],
    default=default_titles # Added default value
)


cards = st.multiselect(
    "Select card titles to display:",
    accept_new_options=True,
    options=[f"Task {i}" for i in range(1, task_examples + 1)] + ["Bug Fix", "Feature A", "Refactor"],
    default=default_cards # Added default value
)

# Collect help text for each selected card
card_help_texts = {}
st.subheader("Card Help Text (Optional)")
with st.expander("Expand to add help text for cards"):
    for card_title in cards:
        help_text = st.text_input(f"Help text for '{card_title}':", key=f"help_{card_title}")
        if help_text:
            card_help_texts[card_title] = help_text

default_tile = st.selectbox("Select default tile:", options=titles)

initial_board = []
# build list of dictionary with title cards (dictionary of ids and titles)
cards_as_dicts = []
for i, card_title in enumerate(cards, start=1):
    card_dict = {"id": str(i), "title": card_title}
    if card_title in card_help_texts:
        card_dict["help"] = card_help_texts[card_title]
    cards_as_dicts.append(card_dict)

for title in titles:
    initial_board.append({
        "title": title,
        "cards": [] if title != default_tile else cards_as_dicts
    })

# Generate a unique key based on the input values
# Include help texts in the key to ensure re-render if help changes
component_key = f"kanban_{'-'.join(titles)}_{'-'.join(cards)}_{default_tile}_{'_'.join(card_help_texts.values())}"

# Add dropdowns for parameters
horizontal_alignment = st.sidebar.selectbox("Horizontal Alignment", ['left', 'center', 'right', 'distribute'], index=0)
vertical_alignment = st.sidebar.selectbox("Vertical Alignment", ['top', 'center', 'bottom', 'distribute'], index=1)
horizontal = st.sidebar.checkbox("Horizontal Layout", value=True)
gap = st.sidebar.selectbox("Gap", ['small', 'medium', 'large'], index=1)

# Width and height with conditional sliders
width_option = st.sidebar.selectbox("Width Option", ['stretch'] + ["pixel"], index=0)
if width_option == "pixel":
    width_value = st.sidebar.slider("Width (pixels)", min_value=50, max_value=1000, value=500)
else:
    width_value = width_option

height_option = st.sidebar.selectbox("Height Option", ['content', 'stretch'] + ["pixel"], index=0)
if height_option == "pixel":
    height_value = st.sidebar.slider("Height (pixels)", min_value=50, max_value=1000, value=500)
else:
    height_value = height_option

border = st.sidebar.checkbox("Show Border")
stacked =st.sidebar.checkbox("Use stacked cards")
use_min_width = st.sidebar.checkbox("Use Minimum Width",value=True)
min_width = st.sidebar.slider("Minimum Width (pixels)", min_value=50, max_value=500, value=250, step=50, disabled=not use_min_width) if use_min_width else None

use_min_height = st.sidebar.checkbox("Use Minimum Height")
min_height = st.sidebar.slider("Minimum Height (pixels)", min_value=50, max_value=500, value=150, step=50, disabled=not use_min_height) if use_min_height else None

# Main column settings
st.sidebar.subheader("Main Column Settings")
use_main_column_min_width = st.sidebar.checkbox("Use Main Column Minimum Width")
main_column_width_option = st.sidebar.selectbox("Main Column Width Option", ['stretch'] + ["pixel"], index=0, disabled=not use_main_column_min_width)
if main_column_width_option == "pixel":
    main_column_min_width = st.sidebar.slider("Main Column Minimum Width (pixels)", min_value=100, max_value=800, value=400, step=50, disabled=not use_main_column_min_width)
else:
    main_column_min_width = main_column_width_option
main_column_min_width = main_column_min_width if use_main_column_min_width else None

use_main_column_min_height = st.sidebar.checkbox("Use Main Column Minimum Height")
main_column_height_option = st.sidebar.selectbox("Main Column Height Option", ['stretch'] + ["pixel"], index=0, disabled=not use_main_column_min_height)
if main_column_height_option == "pixel":
    main_column_min_height = st.sidebar.slider("Main Column Minimum Height (pixels)", min_value=100, max_value=800, value=300, step=50, disabled=not use_main_column_min_height)
else:
    main_column_min_height = main_column_height_option
main_column_min_height = main_column_min_height if use_main_column_min_height else None

# Select which columns are main columns
st.subheader("Main Column Selection")
main_columns = st.multiselect(
    "Select which columns should be main columns:",
    options=titles,
    default=[]  # No columns selected as main by default
)

# Update initial_board to include is_main_column
for column in initial_board:
    column["is_main_column"] = column["title"] in main_columns
st.code(initial_board)
allow_new_categories = st.checkbox("Allow New Categories", value=False)
rename_categories = st.selectbox(
    "Rename Categories",
    options=['none', 'new_only', 'all'],
    format_func=lambda x: {
        'none': 'Disabled',
        'new_only': 'New Categories Only',
        'all': 'All Categories'
    }[x]
)
new_category_title = st.text_input("New Category Title", value="New Category")

if st.toggle("Render component", value=True):
    board_state = kanban_board(
        initial_board,
        horizontal_alignment=horizontal_alignment,
        vertical_alignment=vertical_alignment,
        horizontal=horizontal,
        gap=gap,
        width=width_value,
        height=height_value,
        border=border,
        min_width=min_width,
        min_height=min_height,
        allow_new_categories=allow_new_categories,
        rename_categories=rename_categories,
        new_category_title=new_category_title,
        key=component_key,  # Use the dynamic key here
        stacked=stacked,
        main_column_min_width=main_column_min_width,
        main_column_min_height=main_column_min_height,
        debug_font=True,
    )
    st.write("Current board state:", board_state)
st.json(initial_board, expanded=False)

# with st.container(
#     # horizontal_alignment=horizontal_alignment,
#         # vertical_alignment=vertical_alignment,
#         # horizontal=horizontal,
#         # gap=gap,
#         width=300,
#         height=400,
#         border=True,
#     ):
#     kanban_board(
#         initial_board,
#         horizontal=True,
#         vertical_alignment='top'
#     )
# # with st.container(    horizontal_alignment=horizontal_alignment,
# #         vertical_alignment=vertical_alignment,
# #         horizontal=horizontal,
# #         gap=gap,
# #         width=400,
# #         height=400,
# #         border=border)
# # create an horizontal container with a small height value to test the horizontal scrollbar
# with st.container(

#     horizontal=True,
#     height = 400,
#     width = 400

# ):
#     for i in range(30):
#         st.button(f"i {i}")
