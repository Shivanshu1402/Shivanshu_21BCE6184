import streamlit as st
import websocket
import json
import uuid

# Initialize session state for game state variables
if 'ws' not in st.session_state:
    st.session_state.ws = websocket.WebSocket()
if 'game_id' not in st.session_state:
    st.session_state.game_id = ""
if 'player_id' not in st.session_state:
    st.session_state.player_id = str(uuid.uuid4())
if 'game_grid' not in st.session_state:
    st.session_state.game_grid = [['' for _ in range(5)] for _ in range(5)]
if 'turn' not in st.session_state:
    st.session_state.turn = ""
if 'game_created_or_joined' not in st.session_state:
    st.session_state.game_created_or_joined = False

# Initialize board with pieces
def initialize_board():
    st.session_state.game_grid = [
        ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],  # Player A's initial pieces
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3']   # Player B's initial pieces
    ]

def render_grid(grid):
    st.write("**Game Board:**")
    # Display table headers
    st.write("<style>table {width: 100%; border-collapse: collapse;} th, td {padding: 10px; text-align: center; border: 1px solid black;} th {background-color: #f2f2f2;} </style>", unsafe_allow_html=True)
    
    table_html = '<table>'
    table_html += '<tr><th></th>' + ''.join([f'<th>{i}</th>' for i in range(5)]) + '</tr>'
    
    for i, row in enumerate(grid):
        table_html += f'<tr><th>{i}</th>' + ''.join([f'<td>{cell if cell else ""}</td>' for cell in row]) + '</tr>'
    
    table_html += '</table>'
    st.markdown(table_html, unsafe_allow_html=True)

def connect_ws():
    try:
        st.session_state.ws.connect("ws://localhost:8080")
        st.write("Connected to WebSocket server.")
    except Exception as e:
        st.error(f"Connection error: {e}")

# Connect to the WebSocket server
connect_ws()

# Main function to display game options
def main():
    st.title("Chess-like Game")
    player_name = st.text_input("Enter user name:")
    game_id_input = st.text_input("Enter Game ID (leave empty to create new game):")

    if st.button("Create Game"):
        if not player_name:
            st.error("Please enter your name.")
        else:
            try:
                st.session_state.ws.send(json.dumps({
                    "action": "create_game",
                    "payload": {"id": st.session_state.player_id, "name": player_name}
                }))
                response = st.session_state.ws.recv()
                if not response:
                    st.error("Received empty response from server.")
                else:
                    response = json.loads(response)
                    if 'error' in response:
                        st.error(response['data'])
                    else:
                        data = response['data']  # Ensure the data is parsed correctly
                        st.session_state.game_id = data['gameId']
                        st.write(f"Game created with ID: {st.session_state.game_id}")
                        initialize_board()  # Set up the initial board
                        st.session_state.game_created_or_joined = True
            except websocket.WebSocketConnectionClosedException as e:
                st.error(f"WebSocket connection closed: {e}")
            except Exception as e:
                st.error(f"Error receiving response: {e}")

    if st.button("Join Game"):
        if not player_name:
            st.error("Please enter your name.")
        else:
            try:
                st.session_state.game_id = game_id_input
                st.session_state.ws.send(json.dumps({
                    "action": "join_game",
                    "payload": {"id": st.session_state.player_id, "name": player_name, "gameId": st.session_state.game_id}
                }))
                response = st.session_state.ws.recv()
                if not response:
                    st.error("Received empty response from server.")
                else:
                    response = json.loads(response)
                    if 'error' in response:
                        st.error(response['data'])
                    else:
                        data = response['data']  # Ensure the data is parsed correctly
                        st.session_state.game_grid = data.get('grid', st.session_state.game_grid)
                        st.session_state.turn = data.get('turn', "")
                        st.write(f"Joined game with ID: {st.session_state.game_id}.")
                        st.write(f"It's {st.session_state.turn}'s turn.")
                        st.session_state.game_created_or_joined = True
            except websocket.WebSocketConnectionClosedException as e:
                st.error(f"WebSocket connection closed: {e}")
            except Exception as e:
                st.error(f"Error receiving response: {e}")

    # Display grid and moves selection only if a game is created or joined
    if st.session_state.game_created_or_joined:
        render_grid(st.session_state.game_grid)
        
        # Moves selection UI
        selected_character = st.selectbox("Select your character", ['P1', 'P2', 'P3', 'H1', 'H2'])
        move = st.selectbox("Select move", ['L', 'R', 'F', 'B', 'FL', 'FR', 'BL', 'BR'])
        
        if st.button("Make Move"):
            try:
                st.session_state.ws.send(json.dumps({
                    "action": "make_move",
                    "payload": {"playerId": st.session_state.player_id, "gameId": st.session_state.game_id, "character": selected_character, "move": move}
                }))
                response = st.session_state.ws.recv()
                if not response:
                    st.error("Received empty response from server.")
                else:
                    response = json.loads(response)
                    if 'error' in response:
                        st.error(response['data'])
                    else:
                        data = response['data']  # Ensure the data is parsed correctly
                        st.session_state.game_grid = data.get('grid', st.session_state.game_grid)
                        st.session_state.turn = data.get('nextTurn', "")
                        render_grid(st.session_state.game_grid)
                        st.write(f"It's now {st.session_state.turn}'s turn.")
            except websocket.WebSocketConnectionClosedException as e:
                st.error(f"WebSocket connection closed: {e}")
            except Exception as e:
                st.error(f"Error receiving response: {e}")

if __name__ == "__main__":
    main()