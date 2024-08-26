class Player {
    constructor(socketOrId, nameOrSocket) {
      if (typeof socketOrId === 'object') {
        // Constructor for Player with socket object
        this.socket = socketOrId;
        this.id = socketOrId.id;
        this.name = null;
        this.characters = ['P1', 'P2', 'H1', 'H2']; // Example character setup
      } else {
        // Constructor for Player with ID and name
        this.id = socketOrId;
        this.name = nameOrSocket;
        this.socket = null; // Socket will be null initially
        this.characters = ['P1', 'P2', 'H1', 'H2']; // Example character setup
      }
    }
  
    // Method to assign a socket to a player
    assignSocket(socket) {
      this.socket = socket;
      this.id = socket.id; // Update the player ID with the socket ID
    }
  
    // Method to get the player's characters
    getCharacters() {
      return this.characters;
    }
  
    // Method to set player's characters (if needed)
    setCharacters(characters) {
      this.characters = characters;
    }
  }
  
  module.exports = Player;
  