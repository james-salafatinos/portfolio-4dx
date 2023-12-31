import * as THREE from "/modules/three.module.js";
import { FontLoader } from "/modules/FontLoader.js";
import { TextGeometry } from "/modules/TextGeometry.js";

class Text {
  constructor(scene, camera, gameClient, controls, localPlayerMeshes) {
    this.scene = scene;
    this.camera = camera; // Add the camera reference
    this.gameClient = gameClient;
    this.controls = controls;
    this.localPlayerMeshes = localPlayerMeshes;
    this.textMeshes = {};

    this.initializeFont();
    this.setupChatInterface();
  }

  initializeFont() {
    const loader = new FontLoader();
    loader.load(
      "/modules/helvetiker_regular.typeface.json",
      (font) => (this.font = font),
      undefined,
      (error) => console.error("Error loading font:", error)
    );
  }

  setupChatInterface() {
    this.createChatLog();
    this.createInputField();
    this.setupInputFieldListener();
  }

  createChatLog() {
    this.chatLog = this.createHTMLElement("div", {
      position: "absolute",
      bottom: "50px",
      left: "10px",
      width: "300px",
      height: "200px",
      overflowY: "auto",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
    });
    document.body.appendChild(this.chatLog);
  }

  createInputField() {
    this.inputField = this.createHTMLElement("input", {
      type: "text",
      position: "absolute",
      bottom: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "none",
    });
    document.body.appendChild(this.inputField);
  }

  createHTMLElement(type, styles) {
    const element = document.createElement(type);
    Object.assign(element.style, styles);
    return element;
  }

  setupInputFieldListener() {
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "t" && document.activeElement !== this.inputField) {
        this.toggleInputField();
      }
    });

    this.inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.handleMessageSending();
      }
    });
  }

  toggleInputField() {
    this.controls.ISLOCKED = false;
    const isVisible = this.inputField.style.display === "block";
    this.inputField.style.display = isVisible ? "none" : "block";
    if (!isVisible) {
      this.inputField.value = "";
      setTimeout(() => this.inputField.focus(), 50);
    }
  }

  handleMessageSending() {
    this.sendMessage(this.inputField.value);
    this.inputField.value = "";
    this.inputField.style.display = "none";
    this.controls.ISLOCKED = true;
  }

  sendMessage(message) {
    this.gameClient.sendChatMessage(message);
  }

  updateChatLog(serverMessage) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${serverMessage.id}: ${serverMessage.message}`;
    this.chatLog.appendChild(messageElement);
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
  }

  onServerMessageReceived(message, playersGameState) {
    this.updateChatLog(message);
    this.displayMessageOverPlayer(message, playersGameState);
  }

  displayMessageOverPlayer(message, playersGameState) {
    if (!this.font) {
      console.warn("Font not loaded yet.");
      return;
    }

    const textMesh = this.createTextMesh(message.message);
    const player = playersGameState[message.id];

    if (player) {
      // Initially place the text mesh above the player's head
      this.updateTextMeshPosition(textMesh, player.position);
      this.scene.add(textMesh);

      // Remove the text mesh after a certain duration
      setTimeout(() => this.scene.remove(textMesh), 5000);
    }

    // Store the text mesh with the player's ID for future updates
    this.textMeshes[message.id] = textMesh;
  }

  createTextMesh(message) {
    const textGeometry = new TextGeometry(message, {
      font: this.font,
      size: 0.5,
      height: 0.2,
    });

    // Center the text geometry
    textGeometry.center();

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    return new THREE.Mesh(textGeometry, textMaterial);
  }
  updateFromNetwork(playersGameState) {
    // Update position of all active text meshes
    for (const [playerId, textMesh] of Object.entries(this.textMeshes)) {
      const player = playersGameState[playerId];
      if (player) {
        this.updateTextMeshPosition(textMesh, player.position);
        this.makeTextFaceCamera(textMesh);
      }
    }
  }
  makeTextFaceCamera(textMesh) {
    // Align the text mesh rotation with the camera
    textMesh.lookAt(this.camera.position);
  }

  updateTextMeshPosition(textMesh, playerPosition) {
    // Set the text mesh position to be above the player's head
    const offsetAboveHead = 2; // Adjust this value as needed
    textMesh.position.x = playerPosition.x;
    textMesh.position.y = playerPosition.y + offsetAboveHead;
    textMesh.position.z = playerPosition.z;
  }
}

export { Text };
