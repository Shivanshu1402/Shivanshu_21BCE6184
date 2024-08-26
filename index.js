const WebSocket = require('ws');
const GameManager = require('./gameManager');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('A user connected');

  ws.on('message', async (message) => {
    const { action, payload } = JSON.parse(message);

    try {
      switch (action) {
        case 'create_game':
          // Handle game creation
          const game = await GameManager.createGame(ws); // Pass the WebSocket directly
          ws.send(JSON.stringify({
            action: 'gameCreated',
            data: { gameId: game.gameId, playerId: 'A' }
          }));
          break;

        case 'join_game':
          // Handle joining a game
          const gameToJoin = await GameManager.joinGame(ws, payload.gameId); // Pass the WebSocket and gameId
          if (gameToJoin.error) {
            ws.send(JSON.stringify({ action: 'error', data: gameToJoin.error }));
          } else {
            ws.send(JSON.stringify({
              action: 'gameJoined',
              data: { gameId: gameToJoin.gameId, playerId: 'B', grid: gameToJoin.grid, turn: gameToJoin.turn }
            }));
            // Notify the joining player of the game start
            ws.send(JSON.stringify({
              action: 'startGame',
              data: gameToJoin.getGrid()
            }));
          }
          break;

        case 'make_move':
          // Handle a player's move
          await GameManager.handleMove(ws, message); // Use the updated handleMove method
          break;

        default:
          ws.send(JSON.stringify({ action: 'error', data: 'Unknown action' }));
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ action: 'error', data: 'Internal server error' }));
    }
  });

  ws.on('close', () => {
    GameManager.handleDisconnect(ws); // Handle disconnections
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    ws.close();
  });
});

console.log('WebSocket server is running on ws://localhost:8080');