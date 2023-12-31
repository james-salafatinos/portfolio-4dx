import * as THREE from "/modules/three.module.js";
import { GameClient } from "./Systems/GameClient.js";
import { Cube } from "./Components/Cube.js";
import { Text } from "./Components/Text.js";
import { PlayerManager } from "./Systems/PlayerManager.js";

class Game {
  constructor(scene, camera, controls) {
    this.initializeProperties(scene, camera, controls);
    this.setupGameClientCallbacks();
    this.createGameComponents();
  }

  initializeProperties(scene, camera, controls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.gameClient = new GameClient();
    this.gameState = {};
    this.playerManager = new PlayerManager(this.scene, this.gameClient);
  }

  setupGameClientCallbacks() {
    this.gameClient.setGameUpdateCallback(this.handleGameStateUpdate.bind(this));
    this.gameClient.setPlayerJoinCallback(this.playerManager.onPlayerJoin.bind(this.playerManager));
    this.gameClient.setPlayerLeaveCallback(this.playerManager.onPlayerLeave.bind(this.playerManager));
    this.gameClient.setConnectedPlayersCallback(this.playerManager.onConnectedPlayers.bind(this.playerManager));
    this.gameClient.setPlayerMessageCallback(this.onPlayerMessage.bind(this));
  }

  createGameComponents() {
    this.cube = new Cube(this.scene);
    this.text = new Text(this.scene, this.camera, this.gameClient, this.controls, this.gameState.players);
  }

  update() {
    this.playerManager.handleLocalPlayerMovement(this.camera);
  }

  onPlayerMessage(data) {
    this.text.onServerMessageReceived(data, this.gameState.players);
  }

  handleGameStateUpdate(gameState) {
    this.gameState = gameState;
    this.cube.updateFromNetwork(this.gameState);
    this.text.updateFromNetwork(this.gameState.players);
    this.playerManager.updateFromNetwork(this.gameState.players);
  }
}

export { Game };
