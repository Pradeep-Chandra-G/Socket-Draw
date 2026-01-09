// src/hooks/useSocket.ts

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/types/socket";

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<SocketType | null>(null);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    const socket: SocketType = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("error", (message) => {
      console.error("Socket error:", message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
