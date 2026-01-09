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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-slate-600 font-medium mt-6 text-lg">
          Loading your spaces...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            My Whiteboards
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {whiteboards.length}{" "}
            {whiteboards.length === 1 ? "project" : "projects"} created
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full sm:w-auto shadow-lg shadow-blue-600/30"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              New Whiteboard
            </>
          )}
        </Button>
      </div>

      {whiteboards.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-slate-300 rounded-2xl">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            No whiteboards yet
          </h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            Create your first whiteboard to start collaborating with your team
            in real-time.
          </p>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            size="lg"
            className="shadow-xl shadow-blue-600/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Whiteboard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
