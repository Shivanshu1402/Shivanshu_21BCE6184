// Unit test for joining an existing game when 'join_game' action is received

// Mock WebSocket and GameManager
const WebSocket = require('ws');
const GameManager = require('./gameManager');

jest.mock('ws');
jest.mock('./gameManager');

// Mock WebSocket methods and GameManager functions
WebSocket.mockImplementation(() => ({
  on: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
}));

GameManager.joinGame.mockResolvedValue({
  gameId: '123',
  playerId: 'B',
  grid: [['A', 'B'], ['C', 'D']],
  turn: 'B',
  getGrid: jest.fn(),
});

// Test the selected code
test('joins an existing game when \'join_game\' action is received', async () => {
  const ws = new WebSocket();
  const message = JSON.stringify({ action: 'join_game', payload: { gameId: '123' } });

  // Simulate the 'message' event
  ws.on.mock.calls[0][1](message);

  await new Promise((resolve) => process.nextTick(resolve)); // Wait for the async operations to complete

  expect(GameManager.joinGame).toHaveBeenCalledWith(ws, '123');
  expect(ws.send).toHaveBeenCalledWith(JSON.stringify({
    action: 'gameJoined',
    data: { gameId: '123', playerId: 'B', grid: [['A', 'B'], ['C', 'D']], turn: 'B' },
  }));
  expect(ws.send).toHaveBeenCalledWith(JSON.stringify({
    action: 'startGame',
    data: expect.any(Object), // Assuming getGrid() returns an object
  }));
});