"use client";

import { MoreVertical, Trash2, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Whiteboard } from "@/types/whiteboard";
import Button from "@/components/ui/Button";

interface WhiteboardCardProps {
  whiteboard: Whiteboard;
  onDelete: (id: string) => void;
}

export default function WhiteboardCard({
  whiteboard,
  onDelete,
}: WhiteboardCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link href={`/whiteboard/${whiteboard.id}`} className="block h-full">
        <div className="aspect-video bg-slate-50 relative border-b border-slate-100 flex items-center justify-center overflow-hidden">
          {/* Abstract placeholder pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center z-10">
            <span className="text-2xl font-bold text-blue-600">
              {whiteboard.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-slate-900 truncate pr-8 group-hover:text-blue-600 transition-colors">
            {whiteboard.name}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {whiteboard.createdAt
                ? formatDistanceToNow(new Date(whiteboard.createdAt), {
                    addSuffix: true,
                  })
                : "Just now"}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur shadow-sm hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </Button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <Link
                  href={`/whiteboard/${whiteboard.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Board
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(whiteboard.id);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
