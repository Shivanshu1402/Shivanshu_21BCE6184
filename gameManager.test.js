// gameManager.test.js

const GameManager = require('./gameManager');
const Game = require('./game');

describe('GameManager', () => {
  describe('createGame', () => {
    it('should handle a game with a grid containing invalid characters', async () => {
      const socketMock = {
        send: jest.fn(),
      };

      const invalidGrid = [
        ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'Invalid']
      ];

      const gameManager = new GameManager();
      gameManager.generateGrid = jest.fn().mockReturnValue(invalidGrid);

      await gameManager.createGame(socketMock);

      expect(socketMock.send).toHaveBeenCalledWith(JSON.stringify({
        action: 'error',
        data: 'Invalid characters found in the grid.',
      }));
    });
  });
});