import { OtherPlayer } from "../Components/OtherPlayer.js";

class PlayerManager {
  constructor(scene, gameClient) {
    this.scene = scene;
    this.gameClient = gameClient;
    this.localPlayers = {};
  }

  onPlayerJoin(playerID) {
    console.log("New Player Joined! ", playerID);
  }

  onPlayerLeave(playerID) {
    if (this.localPlayers[playerID]) {
      this.localPlayers[playerID].delete();
      delete this.localPlayers[playerID];
    }
  }

  onConnectedPlayers(data) {
    Object.keys(data).forEach((playerID) => {
      if (
        playerID !== this.gameClient.socket.id &&
        !this.localPlayers[playerID]
      ) {
        this.localPlayers[playerID] = new OtherPlayer(
          this.scene,
          data[playerID]
        );
      }
    });
  }
  handleLocalPlayerMovement(camera) {
    let playerData = {
      id: this.gameClient.socket.id,
      position: camera.position,
      quaternion: camera.quaternion,
    };
    this.gameClient.sendPlayerData(playerData);
  }

  updateFromNetwork(playersData) {
    Object.keys(playersData).forEach((playerID) => {
      if (playerID !== this.gameClient.socket.id) {
        this.localPlayers[playerID].update(playersData[playerID]);
      }
    });
  }
}

export { PlayerManager };
