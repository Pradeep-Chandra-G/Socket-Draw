// src/types/socket.ts

import { WhiteboardElement } from "./whiteboard";

export interface ServerToClientEvents {
  "element:created": (element: WhiteboardElement) => void;
  "element:updated": (element: WhiteboardElement) => void;
  "element:deleted": (elementId: string) => void;
  "elements:sync": (elements: WhiteboardElement[]) => void;
  "user:joined": (data: {
    userId: string;
    userName: string;
    userCount: number;
  }) => void;
  "user:left": (data: { userId: string; userCount: number }) => void;
  "room:full": () => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  "room:join": (data: {
    roomCode: string;
    userId: string;
    userName: string;
  }) => void;
  "room:leave": (roomCode: string) => void;
  "element:create": (data: {
    roomCode: string;
    element: WhiteboardElement;
  }) => void;
  "element:update": (data: {
    roomCode: string;
    element: WhiteboardElement;
  }) => void;
  "element:delete": (data: { roomCode: string; elementId: string }) => void;
  "elements:request": (roomCode: string) => void;
}

export interface RoomData {
  users: Map<string, { userId: string; userName: string }>;
  elements: WhiteboardElement[];
}

