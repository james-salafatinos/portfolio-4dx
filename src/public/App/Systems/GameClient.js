import { io } from "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.esm.min.js";

class GameClient {
  constructor() {
    this.LOCAL_SOCKET_ID = null;
    this.socket = null;
    this.gameUpdateCallback = null;
    this.playerJoinCallback = null;
    this.playerLeaveCallback = null;
    this.connectedPlayersCallback = null;
    this.playerMessageCallback = null;

console.log(window.location.origin)
    // Attempt to connect to server
    this.socket = io.connect(
      // "http://localhost:3000",
      window.location.origin,
      { transports: ["websocket", "polling"] } // forces socket.io to use websockets
    );

    // When we connect to the server, as confirmed by the server
    this.socket.on("connect", () => {
      console.log(
        "Connecting to Server... My connection ID is: ",
        this.socket.id
      );
      this.LOCAL_SOCKET_ID = this.socket.id;
    });

    // When we disconnect from the server
    this.socket.on("disconnect", () => {
      console.log(
        "Disconnected from Server! The connection ID was: ",
        this.socket.id
      );
    });

    // When we receive the authoritative game state
    this.socket.on("authoritativeGameState", (ags) => {
      // console.log("authoritativeGameState: ", ags);
      if (this.gameUpdateCallback) {
        this.gameUpdateCallback(ags);
      }
    });

    // Listening for other player join events
    this.socket.on("playerJoin", (playerData) => {
      if (this.playerJoinCallback) {
        this.playerJoinCallback(playerData);
      }
    });

    // Listening for other player join events
    this.socket.on("connectedPlayers", (data) => {
      if (this.connectedPlayersCallback) {
        this.connectedPlayersCallback(data);
      }
    });

    // Listening for other player leave events
    this.socket.on("playerLeave", (playerID) => {
      if (this.playerLeaveCallback) {
        this.playerLeaveCallback(playerID);
      }
    });

    // Listening for other player leave events
    this.socket.on("playerMessage", (playerID) => {
      if (this.playerMessageCallback) {
        this.playerMessageCallback(playerID);
      }
    });
  }

  // Method to send player data to the server
  sendPlayerData(playerData) {
    this.socket.emit("playerData", playerData);
  }

  // Method to send player data to the server
  sendChatMessage(message) {
    this.socket.emit("chatMessage", message);
  }

  // Method to set the callback for game state updates
  setGameUpdateCallback(callback) {
    this.gameUpdateCallback = callback;
  }

  // Method to set the callback for player join events
  setPlayerJoinCallback(callback) {
    this.playerJoinCallback = callback;
  }

  // Method to set the callback for player leave events
  setPlayerLeaveCallback(callback) {
    this.playerLeaveCallback = callback;
  }
  // Method to set the callback for when a player connects to distribute connected players
  setConnectedPlayersCallback(callback) {
    this.connectedPlayersCallback = callback;
  }

  setPlayerMessageCallback(callback) {
    this.playerMessageCallback = callback;
  }
}

export { GameClient };
