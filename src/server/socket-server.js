// src/server/socket-server.js

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const MAX_USERS_PER_ROOM =
  parseInt(process.env.NEXT_PUBLIC_MAX_ROOM_USERS) || 5;

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("room:join", ({ roomCode, userId, userName }) => {
    const room = rooms.get(roomCode) || {
      users: new Map(),
      elements: [],
    };

    if (room.users.size >= MAX_USERS_PER_ROOM && !room.users.has(socket.id)) {
      socket.emit("room:full");
      return;
    }

    room.users.set(socket.id, { userId, userName });
    rooms.set(roomCode, room);

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    socket.emit("elements:sync", room.elements);

    io.to(roomCode).emit("user:joined", {
      userId,
      userName,
      userCount: room.users.size,
    });

    console.log(
      `User ${userName} joined room ${roomCode}. Total users: ${room.users.size}`
    );
  });

  socket.on("room:leave", (roomCode) => {
    const room = rooms.get(roomCode);
    if (room && room.users.has(socket.id)) {
      const user = room.users.get(socket.id);
      room.users.delete(socket.id);

      socket.leave(roomCode);

      io.to(roomCode).emit("user:left", {
        userId: user.userId,
        userCount: room.users.size,
      });

      if (room.users.size === 0) {
        rooms.delete(roomCode);
        console.log(`Room ${roomCode} deleted (empty)`);
      }
    }
  });

  socket.on("element:create", ({ roomCode, element }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.elements.push(element);
    socket.to(roomCode).emit("element:created", element);
  });

  socket.on("element:update", ({ roomCode, element }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const index = room.elements.findIndex((e) => e.id === element.id);
    if (index !== -1) {
      room.elements[index] = element;
      socket.to(roomCode).emit("element:updated", element);
    }
  });

  socket.on("element:delete", ({ roomCode, elementId }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.elements = room.elements.filter((e) => e.id !== elementId);
    socket.to(roomCode).emit("element:deleted", elementId);
  });

  socket.on("elements:request", (roomCode) => {
    const room = rooms.get(roomCode);
    if (room) {
      socket.emit("elements:sync", room.elements);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const roomCode = socket.data.roomCode;
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room && room.users.has(socket.id)) {
        const user = room.users.get(socket.id);
        room.users.delete(socket.id);

        io.to(roomCode).emit("user:left", {
          userId: user.userId,
          userCount: room.users.size,
        });

        if (room.users.size === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        }
      }
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
