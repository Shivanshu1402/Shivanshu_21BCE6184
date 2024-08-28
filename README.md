Chess-Like Game 
A multiplayer, turn-based, chess-like game developed using Node.js and WebSocket. The game is played on a 5x5 grid with different characters, and the goal is to capture all enemy pieces.

Before you begin, ensure you have met the following requirements:

Node.js: Make sure you have Node.js installed. You can download it from here.
npm: npm (Node Package Manager) comes with Node.js. You can check if you have it installed by running:
npm -v
Git: (Optional) Git is required if you are cloning the repository. You can download it from here.
Installation
Clone the Repository: If you haven't cloned the repository yet, run the following command:

git clone https://github.com/yourusername/HitWicket.git
Replace yourusername with your GitHub username.

Navigate to the Project Directory:
cd HitWicket
Install Dependencies: Run the following command to install all required Node.js packages:
npm install
This will install all the dependencies listed in the package.json file.

Running the Server
To start the backend server that handles game logic and WebSocket communication, follow these steps:

Start the Server:
npm start
This command runs the server using Node.js. The server should start and listen on the specified port (default is usually 3000 or 8080).

Check the Server: Open your browser and navigate to http://localhost:3000 (or the port number you are using). 
You should see the server running.
Running the Game
Open the Game Interface: The game interface can be accessed via a web browser. Since you are using Streamlit for the frontend, you'll need to run the Streamlit app.

Run the Streamlit App: Open a terminal and navigate to the directory where your Streamlit app is located. 
Then run:
streamlit run app.py
This command will start the frontend interface, which you can access at http://localhost:8501 by default.

Connect to the Game: The game supports two players. Open two browser windows or tabs, and connect both to http://localhost:8501.
Each player will take turns playing on the 5x5 grid.

Troubleshooting
If you encounter any issues:

TypeError: game.save is not a function: Make sure the game object is correctly instantiated and has a save method defined in your gameManager.js.
Port Conflicts: If the server doesn't start, it might be due to a port conflict. You can change the port in the server/index.js file or set an environment variable like this:
PORT=4000 npm start
WebSocket Issues: Ensure that WebSockets are properly handled in both the server and the frontend. Check for any connection errors in the browser's developer console.
Project Structure
Chess-Like-Game/
│
├── server/
│   ├── index.js             # Entry point for the Node.js server
│   ├── gameManager.js       # Manages game logic and player states
│   ├── game.js              # Game class implementation
│   └── node_modules/        # Installed dependencies
│
├── client/
│   ├── app.py               # Streamlit app for the frontend
|
├── package.json             # Node.js project dependencies
└── README.md                # This file

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes.
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Create a pull request.
