const { generateGrid, isMoveValid, processMove } = require('./utils');

class Game {
  constructor(gameId, player1Socket) {
    this.gameId = gameId;
    this.grid = generateGrid();
    this.players = {
      A: player1Socket,
      B: null,
    };
    this.turn = 'A';
    this.status = 'in-progress';
  }

  addPlayer(player2Socket) {
    this.players.B = player2Socket;
  }

  isFull() {
    return this.players.A !== null && this.players.B !== null;
  }

  isPlayerTurn(playerId) {
    return this.turn === playerId;
  }

  switchTurn() {
    this.turn = this.turn === 'A' ? 'B' : 'A';
  }

  makeMove(playerId, character, move) {
    if (this.status !== 'in-progress') {
      return { error: 'Game is not in progress.' };
    }
    if (!this.isPlayerTurn(playerId)) {
      return { error: 'Not your turn.' };
    }

    const opponentId = playerId === 'A' ? 'B' : 'A';
    const { success, message, newRow, newCol } = isMoveValid(playerId, character, move, this.grid);

    if (!success) {
      return { error: message };
    }

    processMove(playerId, opponentId, character, newRow, newCol, this.grid);

    // Check if the opponent has no characters left
    const opponentCharacters = this.grid.flat().filter(cell => cell && cell[0] === opponentId);
    if (opponentCharacters.length === 0) {
      this.status = 'finished';
      return { success: true, winner: this.players[playerId].name };
    }

    this.switchTurn();
    return { success: true, grid: this.grid };
  }

  getGrid() {
    return this.grid;
  }

  getState() {
    return {
      gameId: this.gameId,
      grid: this.grid,
      turn: this.turn,
      status: this.status,
    };
  }
}

module.exports = Game;