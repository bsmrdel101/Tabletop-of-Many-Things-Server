import { Server, Socket } from "socket.io";


export default function socketEvents(io: Server, socket: Socket) {
  socket.on('JOIN_ROOM', (username, room, fn) => {
    socket.join(room);

    const clients = io.sockets.adapter.rooms.get(room);
    clients.forEach((clientId) => {
      const clientSocket = io.sockets.sockets.get(clientId);
      clientSocket.data.username = username;
    });

    let dmExists = false;
    io.sockets.sockets.forEach((client) => {
      if (client.data.clientType === 'dm') dmExists = true;
    });

    // Check if the dm already exists
    if (clients && clients.size === 1 || !dmExists) {
      socket.data.clientType = 'dm';
      fn && fn('dm');
    } else {
      socket.data.clientType = 'player';
      fn && fn('player');
    }
  });

  socket.on('GET_PLAYER_LIST', (room, fn) => {
    let clientList: string[] = [];
    const clients = io.sockets.adapter.rooms.get(room);
    clients.forEach((clientId) => {
      const clientSocket = io.sockets.sockets.get(clientId);
      clientList.push(clientSocket.data.username);
    });
    fn(clientList);
  });

  socket.on('MOVE_TOKEN', (token, room) => {
    io.to(room).emit('MOVE_TOKEN', token);
  });

  socket.on('RESIZE_TOKEN', (token, dir, room) => {
    io.to(room).emit('RESIZE_TOKEN', token, dir);
  });

  socket.on('ADD_TOKEN_TO_BOARD', (room) => {
    io.to(room).emit('ADD_TOKEN_TO_BOARD');
  });

  socket.on('REMOVE_TOKEN', (token, room) => {
    io.to(room).emit('REMOVE_TOKEN', token);
  });
  
  socket.on('ROLL_DICE', (result, owner, rollType, targets, damageType, room) => {
    io.to(room).emit('ROLL_DICE', result, owner, rollType, targets, damageType);
  });

  socket.on('SELECT_MAP', (map, room) => {
    io.to(room).emit('SELECT_MAP', map);
  });

  socket.on('VIEW_MAP', (map) => {
    socket.emit('VIEW_MAP', map);
  });

  socket.on('SEND_MESSAGE', (msg, room) => {
    io.to(room).emit('SEND_MESSAGE', msg);
  });

  socket.on('UPDATE_PLAYER', (character, room) => {
    io.to(room).emit('UPDATE_PLAYER', character);
  });
}
