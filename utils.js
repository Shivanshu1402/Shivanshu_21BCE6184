function generateGrid() {
  const grid = Array(5).fill(null).map(() => Array(5).fill(null));

  // Player 1's characters on the first row
  grid[0][0] = 'A-P1'; grid[0][1] = 'A-P2'; grid[0][2] = 'A-H1'; grid[0][3] = 'A-H2'; grid[0][4] = 'A-P3';

  // Player 2's characters on the last row
  grid[4][0] = 'B-P1'; grid[4][1] = 'B-P2'; grid[4][2] = 'B-H1'; grid[4][3] = 'B-H2'; grid[4][4] = 'B-P3';

  return grid;
}

function findCharacterPosition(player, character, grid) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (grid[i][j] === `${player}-${character}`) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

function isMoveValid(player, character, move, grid) {
  const [row, col] = findCharacterPosition(player, character, grid);
  if (row === -1 || col === -1) return { success: false, message: 'Character not found.' };

  let newRow = row, newCol = col;

  switch (character) {
    case 'P1':
    case 'P2':
    case 'P3':
      switch (move) {
        case 'L':
          newCol -= 1;
          break;
        case 'R':
          newCol += 1;
          break;
        case 'F':
          newRow -= 1;
          break;
        case 'B':
          newRow += 1;
          break;
        default:
          return { success: false, message: 'Invalid move command for Pawn.' };
      }
      break;
    case 'H1':
      switch (move) {
        case 'L':
          newCol -= 2;
          break;
        case 'R':
          newCol += 2;
          break;
        case 'F':
          newRow -= 2;
          break;
        case 'B':
          newRow += 2;
          break;
        default:
          return { success: false, message: 'Invalid move command for Hero1.' };
      }
      break;
    case 'H2':
      switch (move) {
        case 'FL':
          newRow -= 2; newCol -= 2;
          break;
        case 'FR':
          newRow -= 2; newCol += 2;
          break;
        case 'BL':
          newRow += 2; newCol -= 2;
          break;
        case 'BR':
          newRow += 2; newCol += 2;
          break;
        default:
          return { success: false, message: 'Invalid move command for Hero2.' };
      }
      break;
    default:
      return { success: false, message: 'Unknown character type.' };
  }

  if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) {
    return { success: false, message: 'Move out of bounds.' };
  }

  if (grid[newRow][newCol] && grid[newRow][newCol][0] === player) {
    return { success: false, message: 'Cannot move to a space occupied by your own character.' };
  }

  return { success: true, newRow, newCol };
}

function processMove(player, opponent, character, newRow, newCol, grid) {
  const [oldRow, oldCol] = findCharacterPosition(player, character, grid);

  // Capture opponent's character if present
  if (grid[newRow][newCol] && grid[newRow][newCol][0] === opponent) {
    grid[newRow][newCol] = null;
  }

  // Move the character to the new position
  grid[newRow][newCol] = `${player}-${character}`;
  grid[oldRow][oldCol] = null;

  return {
    success: true,
    message: `${player}-${character} moved to (${newRow}, ${newCol}).`,
  };
}

module.exports = {
  generateGrid,
  isMoveValid,
  processMove,
};