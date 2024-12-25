import express from "express";
import { configureServer } from "./core/index";
import { Server } from "socket.io";
import http from "http";
import socketEvents from "./core/websockets";

const app = express();
configureServer(app);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  socketEvents(io, socket);
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('=======================');
});
