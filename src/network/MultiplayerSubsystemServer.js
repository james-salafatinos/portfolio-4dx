class MultiplayerSubsystemServer {
  constructor(server) {
    this.authoritativeGameState = {};

    this.io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000/",
        transports: ["websocket", "polling"],
        credentials: true,
      },
      allowEIO3: true,
    });
    console.log("MultiplayerSubsystemServer has been created");

    // Bind methods
    this.updateGame = this.updateGame.bind(this);
    this.createGame = this.createGame.bind(this);
  }

  listen() {
    console.log("MultiplayerSubsystemServer listening...");
    let parent = this;
    //this has to be connection; it is native to socket.io */
    this.io.sockets.on("connection", function (socket) {
      console.log("Server Log: We have a new client: " + socket.id);

      socket.on("onDataFromClient", function (clientGameState) {
        // console.log(
        //   "Server Log: Received 'onDataFromClient' " + clientGameState
        // );
        //inserts the clientGameState into the authoritativeGameState
        parent.authoritativeGameState[socket.id] = JSON.parse(clientGameState);
      });

      //this has to be disconnection; it is native to socket.io */
      socket.on("disconnect", function () {
        delete parent.authoritativeGameState[socket.id];
        console.log("Client ", socket.id, " has disconnected");
      });
    });
  }

  createGame() {}
  updateGame() {
    this.io.emit("onDataFromServer", this.authoritativeGameState); //to everybody
  }
}

exports.MultiplayerSubsystemServer = MultiplayerSubsystemServer;
