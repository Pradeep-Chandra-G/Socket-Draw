// src/components/dashboard/WhiteboardGrid.tsx

"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import WhiteboardCard from "./WhiteboardCard";
import Button from "@/components/ui/Button";
import type { Whiteboard } from "@/types/whiteboard";

export default function WhiteboardGrid() {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      const response = await fetch("/api/whiteboards");
      const data = await response.json();
      setWhiteboards(data.whiteboards || []);
    } catch (error) {
      console.error("Failed to fetch whiteboards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/whiteboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Whiteboard ${whiteboards.length + 1}`,
        }),
      });

      if (response.ok) {
        fetchWhiteboards();
      }
    } catch (error) {
      console.error("Failed to create whiteboard:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/whiteboards/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWhiteboards(whiteboards.filter((w) => w.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete whiteboard:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your spaces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            My Whiteboards
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {whiteboards.length}{" "}
            {whiteboards.length === 1 ? "project" : "projects"} created
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full xs:w-auto shadow-sm"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          <span>{isCreating ? "Creating..." : "New Whiteboard"}</span>
        </Button>
      </div>

      {whiteboards.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No whiteboards yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
            Create your first whiteboard to start collaborating with your team
            in real-time.
          </p>
          <Button onClick={handleCreate} disabled={isCreating}>
            Create Whiteboard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {whiteboards.map((whiteboard) => (
            <WhiteboardCard
              key={whiteboard.id}
              whiteboard={whiteboard}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
