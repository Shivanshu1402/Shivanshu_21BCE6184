const { v4: uuidv4 } = require('uuid');
const Game = require('./game');

class GameManager {
  constructor() {
    this.games = new Map();
    this.clients = new Map(); // Map to track clients by game ID
  }

  async createGame(socket) {
    const gameId = uuidv4(); // Generate unique game ID using UUID
    const game = new Game({
      gameId,
      grid: this.generateGrid(),
      turn: 'A'
    });
    await game.save();
    this.games.set(gameId, game); // Store the game in the map

    this.addClientToGame(gameId, socket); // Add the socket to the game
    this.sendToSocket(socket, JSON.stringify({
      action: 'gameCreated',
      data: { gameId, playerId: 'A' }
    }));

    console.log('Game created:', gameId);
    return game;
  }

  async joinGame(socket, gameId) {
    const game = await Game.findOne({ gameId });
    if (game) {
      this.addClientToGame(gameId, socket); // Add the socket to the game

      this.sendToSocket(socket, JSON.stringify({
        action: 'gameJoined',
        data: { gameId, playerId: 'B', grid: game.grid, turn: game.turn }
      }));
      this.broadcastToGame(gameId, JSON.stringify({
        action: 'startGame',
        data: game
      })); // Notify players to start the game

      console.log('Player joined game:', gameId);
      return game;
    } else {
      this.sendToSocket(socket, JSON.stringify({
        action: 'error',
        data: 'Game not found.'
      }));
      return { error: 'Game not found.' };
    }
  }

  async handleMove(socket, message) {
    const { gameId, playerId, character, move } = JSON.parse(message);
    const game = await Game.findOne({ gameId });
    if (game && game.turn === playerId) {
      const result = this.makeMove(game, playerId, character, move);
      if (result.success) {
        game.moves.push({ playerId, character, move });
        game.grid = result.grid;
        game.turn = result.nextTurn;
        await game.save();

        this.broadcastToGame(gameId, JSON.stringify({
          action: 'moveProcessed',
          data: { grid: game.grid, message: result.message, nextTurn: game.turn }
        }));
        console.log(result.message);
      } else {
        this.sendToSocket(socket, JSON.stringify({
          action: 'invalidMove',
          data: result.message
        }));
      }
    } else {
      this.sendToSocket(socket, JSON.stringify({
        action: 'error',
        data: 'It is not your turn or game does not exist.'
      }));
    }
  }

  generateGrid() {
    return [
      ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3']
    ];
  }

  makeMove(game, playerId, character, move) {
    // Implement the move logic here
    // Return { success: true, grid: updatedGrid, nextTurn: nextPlayerId, message: 'Move successful' }
  }

  handleDisconnect(socket) {
    for (const [gameId, game] of this.games.entries()) {
      if (this.clients.get(gameId).has(socket)) {
        this.broadcastToGame(gameId, JSON.stringify({
          action: 'playerDisconnected'
        }));
        this.games.delete(gameId); // Remove game if a player disconnects
        this.clients.delete(gameId); // Remove clients for the game
        console.log('Game ended due to player disconnect:', gameId);
        break;
      }
    }
  }

  addClientToGame(gameId, socket) {
    if (!this.clients.has(gameId)) {
      this.clients.set(gameId, new Set());
    }
    this.clients.get(gameId).add(socket);
  }

  sendToSocket(socket, message) {
    socket.send(message);
  }

  broadcastToGame(gameId, message) {
    if (this.clients.has(gameId)) {
      this.clients.get(gameId).forEach(client => {
        client.send(message);
      });
    }
  }
}

module.exports = new GameManager();