require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: cors });

const { PORT } = process.env;

app.get("/", (req, res) => {
  res.send("server is up");
});

io.on("connect", (socket) => {
  const { userName, room } = socket.handshake.query;
  socket.join(room);

  socket.on("message", (message) => {
    socket.to(room).emit("message", message);
  });

  socket.on("disconnecting", () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
  });
  console.log("a user connected", { userName, room });
});

server.listen(parseInt(PORT, 10), () => {
  console.log(`listening on *:${PORT}`);
});
