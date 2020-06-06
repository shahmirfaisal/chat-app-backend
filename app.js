const express = require("express");
const http = require("http");
const formateMessage = require("./utils/formateMessage");
const { joinRoom, leaveRoom, getRoomUsers } = require("./utils/user");

const app = express();

const server = http.createServer(app);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ name, room }) => {
    socket.join(room);
    const user = joinRoom(socket.id, name, room);

    socket
      .to(room)
      .emit(
        "message",
        formateMessage("ChatBot", `${name} has joined the chat.`)
      );
    socket.emit(
      "message",
      formateMessage("ChatBot", `Welcome to the ${room} room, ${name}.`)
    );
    io.in(room).emit("roomUsers", getRoomUsers(room));
    socket.on("chatMessage", (msg) => {
      io.in(room).emit("message", formateMessage(name, msg));
    });

    socket.on("disconnect", () => {
      leaveRoom(socket.id);
      socket
        .to(room)
        .emit(
          "message",
          formateMessage("ChatBot", `${name} has left the chat`)
        );
      io.to(room).emit("roomUsers", getRoomUsers(room));
    });
  });
});

server.listen(5000);
