const THREE = require("three");
const socketIO = require("socket.io");
const port = process.env.ENVIRONMENT === "PROD" ? 8080 : 3000;

class MultiplayerSubsystemServer {
  constructor(server) {
    this.authoritativeGameState = {
      players: {},
      Cube: {
        id: "Cube",
        position: new THREE.Vector3(0, 0, 0),
        quaternion: new THREE.Quaternion(0, 0, 0, 1),
      },
    };
    this.io = socketIO(server, {
      cors: {
        origin: `http://localhost:${port}/`,
        transports: ["websocket", "polling"],
        credentials: true,
      },
      allowEIO3: true,
    });

    console.log("MultiplayerSubsystemServer has been created");
    this.listen();
  }


  // Listen for client connections and events
  listen() {
    console.log(`MultiplayerSubsystemServer listening at ${port}...`);
    this.io.sockets.on("connection", (socket) => {
      console.log("Server Log: We have a new client: " + socket.id);

      this.addPlayer(socket);
      this.handlePlayerDisconnection(socket);
      this.handlePlayerData(socket);
      this.handleChatMessage(socket);
    });
  }

  // Add a new player to the game state
  addPlayer(socket) {
    this.authoritativeGameState.players[socket.id] = {
      id: socket.id,
      type: "player",
      position: new THREE.Vector3(0, 0, 0),
      quaternion: new THREE.Quaternion(0, 0, 0, 1),
    };
    this.io.emit("playerJoin", this.authoritativeGameState.players[socket.id]);
    this.io.emit("connectedPlayers", this.authoritativeGameState.players);
  }

  // Handle player disconnection
  handlePlayerDisconnection(socket) {
    socket.on("disconnect", () => {
      console.log("Client ", socket.id, " has disconnected");
      delete this.authoritativeGameState.players[socket.id];
      this.io.emit("playerLeave", socket.id);
      this.io.emit("connectedPlayers", this.authoritativeGameState.players);
    });
  }

  // Update player data based on client input
  handlePlayerData(socket) {
    socket.on("playerData", (playerData) => {
      try {
        this.updatePlayerState(playerData);
      } catch (error) {
        console.error("Error updating player data: ", error);
      }
    });
  }

  // Update player state with received data
  updatePlayerState(playerData) {
    let player = this.authoritativeGameState.players[playerData.id];
    if (player) {
      player.position.set(
        playerData.position.x,
        playerData.position.y,
        playerData.position.z
      );
      player.quaternion.set(
        playerData.quaternion[0],
        playerData.quaternion[1],
        playerData.quaternion[2],
        playerData.quaternion[3]
      );
    }
  }

  // Handle chat messages from players
  handleChatMessage(socket) {
    socket.on("chatMessage", (message) => {
      console.log(`Received message from ${socket.id}: ${message}`);
      this.authoritativeGameState.players[socket.id].message = message;
      this.io.emit("playerMessage", { id: socket.id, message });
    });
  }

  // Update game logic
  updateGame() {

    let proximity = this._computePlayerProximityToCube(
      this.authoritativeGameState["Cube"].position
    );
    let rate = (Math.PI / 180) * proximity;
    let rotateQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      rate
    );
    this.authoritativeGameState["Cube"].quaternion.multiply(rotateQuaternion);
    this.io.emit("authoritativeGameState", this.authoritativeGameState);
  }

  // Compute the proximity of players to the cube
  _computePlayerProximityToCube(cubePos) {
    let V = new THREE.Vector3(0, 0, 0);
    Object.values(this.authoritativeGameState.players).forEach((player) => {
      V.add(player.position);
    });
    return V.distanceTo(cubePos);
  }
}

exports.MultiplayerSubsystemServer = MultiplayerSubsystemServer;
