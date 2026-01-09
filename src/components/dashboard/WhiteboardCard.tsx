// src/components/dashboard/WhiteboardCard.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ExternalLink, Copy, MoreVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Whiteboard } from "@/types/whiteboard";

interface WhiteboardCardProps {
  whiteboard: Whiteboard;
  onDelete: (id: string) => void;
}

export default function WhiteboardCard({
  whiteboard,
  onDelete,
}: WhiteboardCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const elementCount = Array.isArray(whiteboard.elements)
    ? whiteboard.elements.length
    : 0;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(whiteboard.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this whiteboard?")) {
      onDelete(whiteboard.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div
        onClick={() => router.push(`/whiteboard/${whiteboard.id}`)}
        className="cursor-pointer p-4 sm:p-6"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
            {whiteboard.name}
          </h3>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Updated {formatDate(whiteboard.updatedAt)}</span>
            <span className="font-medium">{elementCount} elements</span>
          </div>

          <div className="flex items-center gap-2">
            <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
              {whiteboard.roomCode}
            </code>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyCode();
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Copy room code"
            >
              {copied ? (
                <span className="text-green-600 text-xs">✓</span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => router.push(`/whiteboard/${whiteboard.id}`)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <span>Open Whiteboard</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
