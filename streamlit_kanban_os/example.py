import streamlit as st
from streamlit_kanban_os import kanban_board
if st.session_state.get("reruns", None) is None:
    st.session_state.reruns = 0
st.toast(f"Reruns: {st.session_state.reruns}")
st.session_state.reruns += 1
# Explanation of the Kanban board
st.title("Kanban Board Component")
st.write("""
This is a customizable Kanban board component for Streamlit. It allows you to organize tasks into columns and move them around.
The state of the board is passed back to streamlit so it can be used to enriche your application.
Experiment with important features like creating a main column (to highlight important tasks), horizontal or vertical layouts, adding helping text on hover to cards, or allowing users to create new categories on the fly!
""")

# Sidebar customizations
st.sidebar.title("Customization Options")

task_examples = 3

# Default options for multiselects
default_titles = ["To Do", "In Progress", "Done"]

default_cards = [f"Task {i}" for i in range(1, task_examples + 1)]

# Board Content
st.sidebar.subheader("Board Content")
titles = st.sidebar.multiselect(
    "Select column titles to display:",
    accept_new_options=True,
    options=["To Do", "In Progress", "Done"]+["To Do", "In Progress", "Done", "Review", "Blocked"],
    default=default_titles # Added default value
)

cards = st.sidebar.multiselect(
    "Select card titles to display:",
    accept_new_options=True,
    options=[f"Task {i}" for i in range(1, task_examples + 1)] + ["Bug Fix", "Feature A", "Refactor"],
    default=default_cards # Added default value
)

default_tile = st.sidebar.selectbox("Select default tile:", options=titles)

# Collect help text for each selected card
card_help_texts = {}
with st.sidebar.expander("Add help text for cards (Optional)"):
    for card_title in cards:
        help_text = st.text_input(f"Help text for '{card_title}':", key=f"help_{card_title}")
        if help_text:
            card_help_texts[card_title] = help_text


st.sidebar.divider()

# Categories
st.sidebar.subheader("Categories")
allow_new_categories = st.sidebar.checkbox("Allow New Categories", value=False)
rename_categories = st.sidebar.selectbox(
    "Rename Categories",
    options=['none', 'new_only', 'all'],
    format_func=lambda x: {
        'none': 'Disabled',
        'new_only': 'New Categories Only',
        'all': 'All Categories'
    }[x]
)
new_category_title = st.sidebar.text_input("New Category Title", value="New Category")

st.sidebar.divider()

# Layout & Theming
st.sidebar.subheader("Layout & Theming")
horizontal_alignment = st.sidebar.selectbox("Horizontal Alignment", ['left', 'center', 'right', 'distribute'], index=0)
vertical_alignment = st.sidebar.selectbox("Vertical Alignment", ['top', 'center', 'bottom', 'distribute'], index=1)
horizontal = st.sidebar.checkbox("Horizontal Layout", value=True)
gap = st.sidebar.selectbox("Gap", ['small', 'medium', 'large'], index=1)
st.sidebar.selectbox("Select Font", key="selected_font", options=["NotoSans","","spartan", ],help="This component can access any font passed trough the app static folder to the frontend (check the developer console sources to confirm) by default the streamlit font is passed and used.")
st.sidebar.pills("Show debugging info for font loading",options=[True,False],key='show_font_debug',default=False)
st.sidebar.divider()

# Dimensions & Sizing
st.sidebar.subheader("Dimensions & Sizing")
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

use_min_width = st.sidebar.checkbox("Use Minimum Width",value=True)
min_width = st.sidebar.slider("Minimum Width (pixels)", min_value=50, max_value=500, value=250, step=50, disabled=not use_min_width) if use_min_width else None

use_min_height = st.sidebar.checkbox("Use Minimum Height",value=True)
min_height = st.sidebar.slider("Minimum Height (pixels)", min_value=50, max_value=500, value=150, step=50, disabled=not use_min_height) if use_min_height else None

st.sidebar.divider()

# Main Column Settings
st.sidebar.subheader("Main Column Settings")
st.sidebar.info("Main columns are highlighted columns that can be used to emphasize important steps or categories.")
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
main_columns = st.sidebar.multiselect(
    "Select which columns should be main columns:",
    options=titles,
    default=[]  # No columns selected as main by default
)

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

# Update initial_board to include is_main_column
for column in initial_board:
    column["is_main_column"] = column["title"] in main_columns

# selectedst.sidebar.text.input
# Render the Kanban boards
st.subheader("Regular Kanban Board")
board_state_regular = kanban_board(
    initial_board,
    horizontal_alignment=horizontal_alignment,
    vertical_alignment=vertical_alignment,
    horizontal=horizontal,
    gap=gap,
    width=width_value,
    height=height_value,
    min_width=min_width,
    min_height=min_height,
    allow_new_categories=allow_new_categories,
    rename_categories=rename_categories,
    new_category_title=new_category_title,
    key=f"{component_key}_regular",  # Use the dynamic key here
    main_column_min_width=main_column_min_width,
    main_column_min_height=main_column_min_height,
    debug_font=st.session_state.show_font_debug,
    font_file_name=st.session_state.selected_font
)

st.subheader("Stacked Kanban Board (Mobile-Friendly)")
board_state_stacked = kanban_board(
    initial_board,
    horizontal_alignment=horizontal_alignment,
    vertical_alignment=vertical_alignment,
    horizontal=horizontal,
    gap=gap,
    width=width_value,
    height=height_value,
    min_width=min_width,
    min_height=min_height,
    allow_new_categories=allow_new_categories,
    rename_categories=rename_categories,
    new_category_title=new_category_title,
    key=f"{component_key}_stacked",  # Use the dynamic key here
    stacked=True,
    main_column_min_width=main_column_min_width,
    main_column_min_height=main_column_min_height,
    debug_font=st.session_state.show_font_debug,
    font_file_name=st.session_state.selected_font
)


# Optional expander to see how it looks in Python
with st.expander("View what python sees"):
    st.write("Regular board state:", board_state_regular)
    st.write("Stacked board state:", board_state_stacked)

with st.expander("How can I use this component?"):
    st.write("The code for this components is open source, you can either download our wheels file by going to our github or downloade it and build it with poetry (we recommend using devcontainer to quickly setup a poetry enviroment and cloning the repo).")
