// src/types/whiteboard.ts

export type ToolType =
  | "pencil"
  | "rectangle"
  | "circle"
  | "arrow"
  | "text"
  | "eraser"
  | "select";

export type Permission = "VIEW" | "EDIT";

export interface Point {
  x: number;
  y: number;
}

export interface WhiteboardElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Point[];
  color: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface Whiteboard {
  id: string;
  name: string;
  roomCode: string;
  elements: WhiteboardElement[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  permissions?: WhiteboardPermission[];
}

export interface WhiteboardPermission {
  id: string;
  whiteboardId: string;
  userId: string;
  permission: Permission;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}


