// src/components/dashboard/WhiteboardGrid.tsx

"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading whiteboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Whiteboards
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {whiteboards.length}{" "}
            {whiteboards.length === 1 ? "whiteboard" : "whiteboards"}
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={isCreating}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>{isCreating ? "Creating..." : "New Whiteboard"}</span>
        </Button>
      </div>

      {whiteboards.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No whiteboards yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Create your first whiteboard to start collaborating
          </p>
          <Button onClick={handleCreate} disabled={isCreating}>
            Create Whiteboard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
