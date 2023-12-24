import * as THREE from "/modules/three.module.js";
import { LocalNetworkedPlayer } from "./LocalNetworkedPlayer.js";
import { io } from "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.esm.min.js";

let LOCAL_SOCKET_ID = null;
class NetworkGame {
  constructor(localGameState, scene, camera) {
    this.localGameState = localGameState; //imbued from Game
    this.localScene = scene;
    this.localCamera = camera;
    this.networkPlayerIDs = [];
    this.networkPlayerObjects = [];

    let parent = this;

    //Attempt to connect to server
    this.socket = io.connect(
      "http://localhost:3000",
      { transports: ["websocket", "polling"] } // forces socket.io to use websockets
    );

    //When we connect to the server, as confirmed by the server
    this.socket.on("connect", () => {
      console.log("Connected to Server! My connection ID is: ", this.socket.id);
      LOCAL_SOCKET_ID = this.socket.id;
    });

    // When we receive broadcasted data, update the game environment
    this.socket.on("onDataFromServer", function (authoritativeGameStateData) {
      for (let _id in authoritativeGameStateData) {
        if (_id !== LOCAL_SOCKET_ID) {
          if (!parent.networkPlayerIDs.includes(_id)) {
            let networkPlayer = new LocalNetworkedPlayer(
              parent.localScene,
              parent.localCamera
            );
            parent.networkPlayerIDs.push(_id);
            parent.networkPlayerObjects[_id] = networkPlayer;
          }
          if (parent.networkPlayerIDs.includes(_id)) {
            console.log(
              parent.networkPlayerObjects[_id].player.quaternion,
              authoritativeGameStateData[_id].quaternion
            );
            parent.networkPlayerObjects[_id].player.position.copy(
              authoritativeGameStateData[_id].position
            );
            parent.networkPlayerObjects[_id].player.quaternion._x =
              authoritativeGameStateData[_id].quaternion[0];
            parent.networkPlayerObjects[_id].player.quaternion._y =
              authoritativeGameStateData[_id].quaternion[1];
            parent.networkPlayerObjects[_id].player.quaternion._z =
              authoritativeGameStateData[_id].quaternion[2];
            parent.networkPlayerObjects[_id].player.quaternion._w =
              authoritativeGameStateData[_id].quaternion[3];
          }
        }
      }
    });
  }

  create() {}

  pushUpLocalGameState() {
    let success = false;
    try {
      this.socket.emit("onDataFromClient", JSON.stringify(this.localGameState));
      success = true;
    } catch (e) {
      console.log(e);
    }
    return success;
  }
}

class Game {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.gameState = {};
    this.localNetworkedPlayer = null;
    this.localPlayerSocketID = null;

    this.create();
  }

  create() {
    this.localNetworkedPlayer = new LocalNetworkedPlayer(
      this.scene,
      this.camera
    );
    this.networkGame = new NetworkGame(this.gameState, this.scene, this.camera);

    //Set time out to then set gamestate file to include the handshaked ID
    setTimeout(() => {
      this.gameState["_id"] = this.networkGame.socket.id;
    }, 500);
  }

  update() {
    //Local Player Update
    this.localNetworkedPlayer.update();

    if (this.gameState["_id"]) {
      this.gameState["position"] = this.localNetworkedPlayer.player.position;
      this.gameState["quaternion"] =
        this.localNetworkedPlayer.player.quaternion;
    }

    this.networkGame.pushUpLocalGameState();
  }
}

export { Game };
