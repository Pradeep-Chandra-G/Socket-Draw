// src/app/whiteboard/[id]/page.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Share2, Save, Trash2, Users } from "lucide-react";
import Canvas from "@/components/whiteboard/Canvas";
import Toolbar from "@/components/whiteboard/Toolbar";
import ColorPicker from "@/components/whiteboard/ColorPicker";
import FontSelector from "@/components/whiteboard/FontSelector";
import ShareModal from "@/components/whiteboard/ShareModal";
import ExportMenu from "@/components/whiteboard/ExportMenu";
import JoinRoomModal from "@/components/whiteboard/JoinRoomModal";
import Button from "@/components/ui/Button";
import { useWhiteboard } from "@/hooks/useWhiteboard";
import { useSocket } from "@/hooks/useSocket";
import type { Whiteboard, WhiteboardElement } from "@/types/whiteboard";

interface RemoteCursor {
  x: number;
  y: number;
  userId: string;
  userName: string;
  color: string;
}

const CURSOR_COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export default function WhiteboardEditor() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [whiteboard, setWhiteboard] = useState<Whiteboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(
    new Map()
  );
  const lastSaveRef = useRef<string>("");
  const userColorRef = useRef<string>(""); // Store user's assigned color

  const {
    elements,
    setElements,
    selectedTool,
    setSelectedTool,
    selectedColor,
    setSelectedColor,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    currentElement,
    startDrawing,
    updateDrawing,
    finishDrawing,
    addText,
    clearCanvas,
  } = useWhiteboard();

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchWhiteboard();
    }
  }, [params.id, status]);

  useEffect(() => {
    if (!socket || !isConnected || !whiteboard || !session) return;

    // Assign a consistent color for this user session
    if (!userColorRef.current) {
      const userIndex = Math.floor(Math.random() * CURSOR_COLORS.length);
      userColorRef.current = CURSOR_COLORS[userIndex];
    }

    socket.emit("room:join", {
      roomCode: whiteboard.roomCode,
      userId: session.user.id,
      userName: session.user.name || session.user.email,
    });

    socket.on("elements:sync", (syncedElements: WhiteboardElement[]) => {
      console.log("Received synced elements:", syncedElements.length);
      setElements(syncedElements);
    });

    socket.on("element:created", (element: WhiteboardElement) => {
      setElements((prev) => [...prev, element]);
    });

    socket.on("element:updated", (element: WhiteboardElement) => {
      setElements((prev) =>
        prev.map((el) => (el.id === element.id ? element : el))
      );
    });

    socket.on("element:deleted", (elementId: string) => {
      setElements((prev) => prev.filter((el) => el.id !== elementId));
    });

    socket.on("user:joined", ({ userCount }: { userCount: number }) => {
      setUserCount(userCount);
    });

    socket.on("user:left", ({ userCount }: { userCount: number }) => {
      setUserCount(userCount);
    });

    socket.on(
      "cursor:move",
      ({ userId, userName, x, y, color }: RemoteCursor) => {
        if (userId !== session.user.id) {
          setRemoteCursors((prev) => {
            const updated = new Map(prev);
            updated.set(userId, { userId, userName, x, y, color });
            return updated;
          });
        }
      }
    );

    socket.on("cursor:remove", ({ userId }: { userId: string }) => {
      setRemoteCursors((prev) => {
        const updated = new Map(prev);
        updated.delete(userId);
        return updated;
      });
    });

    socket.on("room:full", () => {
      alert("Room is full! Maximum 5 users allowed.");
      router.push("/dashboard");
    });

    return () => {
      if (whiteboard) {
        socket.emit("room:leave", whiteboard.roomCode);
      }
      socket.off("elements:sync");
      socket.off("element:created");
      socket.off("element:updated");
      socket.off("element:deleted");
      socket.off("user:joined");
      socket.off("user:left");
      socket.off("room:full");
      socket.off("cursor:move");
      socket.off("cursor:remove");
    };
  }, [socket, isConnected, whiteboard, session]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSave(true);
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(interval);
  }, [elements]);

  const fetchWhiteboard = async () => {
    try {
      const response = await fetch(`/api/whiteboards/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setWhiteboard(data.whiteboard);
        // Properly parse elements if they're stored as JSON string
        const savedElements = Array.isArray(data.whiteboard.elements)
          ? data.whiteboard.elements
          : typeof data.whiteboard.elements === "string"
          ? JSON.parse(data.whiteboard.elements)
          : [];
        setElements(savedElements);
        console.log("Loaded elements:", savedElements.length);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch whiteboard:", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (silent = false) => {
    if (!whiteboard) return;

    const currentState = JSON.stringify(elements);
    if (currentState === lastSaveRef.current) return;

    if (!silent) setIsSaving(true);

    try {
      const response = await fetch(`/api/whiteboards/${whiteboard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements }),
      });

      if (response.ok) {
        lastSaveRef.current = currentState;
        if (!silent) {
          // Show success feedback
          setTimeout(() => setIsSaving(false), 500);
        }
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      if (!silent) {
        setTimeout(() => setIsSaving(false), 1000);
      }
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      clearCanvas();
      if (socket && whiteboard) {
        elements.forEach((el) => {
          socket.emit("element:delete", {
            roomCode: whiteboard.roomCode,
            elementId: el.id,
          });
        });
      }
    }
  };

  const handleElementCreate = (element: WhiteboardElement) => {
    if (socket && whiteboard) {
      socket.emit("element:create", {
        roomCode: whiteboard.roomCode,
        element,
      });
    }
  };

  const handleCursorMove = (x: number, y: number) => {
    if (socket && whiteboard && session && userCount > 1) {
      socket.emit("cursor:move", {
        roomCode: whiteboard.roomCode,
        userId: session.user.id,
        userName: session.user.name || session.user.email,
        x,
        y,
        color: userColorRef.current,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 font-medium text-lg">
            Loading whiteboard...
          </p>
        </div>
      </div>
    );
  }

  if (!whiteboard) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200 px-4 py-3 sm:px-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex-1">
            {whiteboard.name}
          </h1>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">
              {userCount}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saved!" : "Save"}</span>
            </Button>

            <Button
              onClick={() => setShowJoinModal(true)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Join</span>
            </Button>

            <Button
              onClick={() => setShowShareModal(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none shadow-lg shadow-blue-600/30"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar Area */}
      <div className="bg-white border-b-2 border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Toolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />
          <ColorPicker
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
          {selectedTool === "text" && (
            <FontSelector
              fontFamily={fontFamily}
              fontSize={fontSize}
              onFontFamilyChange={setFontFamily}
              onFontSizeChange={setFontSize}
            />
          )}
          <div className="flex gap-2 ml-auto">
            <ExportMenu
              elements={elements}
              canvasRef={canvasRef}
              whiteboardName={whiteboard.name}
            />
            <Button
              onClick={handleClear}
              variant="danger"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-white relative">
        <Canvas
          ref={canvasRef}
          elements={elements}
          currentElement={currentElement}
          selectedTool={selectedTool}
          onStartDrawing={startDrawing}
          onUpdateDrawing={updateDrawing}
          onFinishDrawing={(element) => {
            finishDrawing();
            if (element) handleElementCreate(element);
          }}
          onAddText={(text, x, y) => {
            addText(text, x, y);
          }}
          onCursorMove={handleCursorMove}
        />

        {/* Remote Cursors - Only show when multiple users */}
        {userCount > 1 &&
          Array.from(remoteCursors.values()).map((cursor) => (
            <div
              key={cursor.userId}
              className="absolute pointer-events-none z-50"
              style={{
                left: cursor.x,
                top: cursor.y,
                transform: "translate(-2px, -2px)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 3.5L19.5 12L12 13.5L9.5 20.5L5.5 3.5Z"
                  fill={cursor.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              <div
                className="mt-1 px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap shadow-lg"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.userName}
              </div>
            </div>
          ))}
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        roomCode={whiteboard.roomCode}
        userCount={userCount}
        maxUsers={5}
      />

      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  );
}
