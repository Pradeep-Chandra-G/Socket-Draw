// src/app/whiteboard/[id]/page.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Share2, Save, Trash2 } from "lucide-react";
import Canvas from "@/components/whiteboard/Canvas";
import Toolbar from "@/components/whiteboard/Toolbar";
import ColorPicker from "@/components/whiteboard/ColorPicker";
import FontSelector from "@/components/whiteboard/FontSelector";
import ShareModal from "@/components/whiteboard/ShareModal";
import ExportMenu from "@/components/whiteboard/ExportMenu";
import Button from "@/components/ui/Button";
import { useWhiteboard } from "@/hooks/useWhiteboard";
import { useSocket } from "@/hooks/useSocket";
import type { Whiteboard } from "@/types/whiteboard";

export default function WhiteboardEditor() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [whiteboard, setWhiteboard] = useState<Whiteboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!session) {
      router.push("/auth/login");
      return;
    }

    fetchWhiteboard();
  }, [params.id, session]);

  useEffect(() => {
    if (!socket || !isConnected || !whiteboard || !session) return;

    socket.emit("room:join", {
      roomCode: whiteboard.roomCode,
      userId: session.user.id,
      userName: session.user.name || session.user.email,
    });

    socket.on("elements:sync", (syncedElements) => {
      setElements(syncedElements);
    });

    socket.on("element:created", (element) => {
      setElements((prev) => [...prev, element]);
    });

    socket.on("element:updated", (element) => {
      setElements((prev) =>
        prev.map((el) => (el.id === element.id ? element : el))
      );
    });

    socket.on("element:deleted", (elementId) => {
      setElements((prev) => prev.filter((el) => el.id !== elementId));
    });

    socket.on("user:joined", ({ userCount }) => {
      setUserCount(userCount);
    });

    socket.on("user:left", ({ userCount }) => {
      setUserCount(userCount);
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
    };
  }, [socket, isConnected, whiteboard, session]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSave(true);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [elements]);

  const fetchWhiteboard = async () => {
    try {
      const response = await fetch(`/api/whiteboards/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setWhiteboard(data.whiteboard);
        setElements(data.whiteboard.elements || []);
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

    if (!silent) setIsSaving(true);

    try {
      await fetch(`/api/whiteboards/${whiteboard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements }),
      });
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      if (!silent) setIsSaving(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading whiteboard...</p>
        </div>
      </div>
    );
  }

  if (!whiteboard) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
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

          <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
            {whiteboard.name}
          </h1>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </Button>

            <Button
              onClick={() => setShowShareModal(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar Area */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 min-w-max">
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
      <div className="flex-1 overflow-hidden">
        <Canvas
          elements={elements}
          currentElement={currentElement}
          selectedTool={selectedTool}
          onStartDrawing={startDrawing}
          onUpdateDrawing={updateDrawing}
          onFinishDrawing={finishDrawing}
          onAddText={addText}
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        roomCode={whiteboard.roomCode}
        userCount={userCount}
        maxUsers={5}
      />
    </div>
  );    
}
