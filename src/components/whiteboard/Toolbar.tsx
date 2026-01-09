// src/components/whiteboard/Toolbar.tsx

"use client";

import { Pencil, Square, Circle, ArrowRight, Type, Eraser } from "lucide-react";
import type { ToolType } from "@/types/whiteboard";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  className?: string;
}

const tools = [
  { type: "pencil" as ToolType, icon: Pencil, label: "Pencil" },
  { type: "rectangle" as ToolType, icon: Square, label: "Rectangle" },
  { type: "circle" as ToolType, icon: Circle, label: "Circle" },
  { type: "arrow" as ToolType, icon: ArrowRight, label: "Arrow" },
  { type: "text" as ToolType, icon: Type, label: "Text" },
  { type: "eraser" as ToolType, icon: Eraser, label: "Eraser" },
];

export default function Toolbar({
  selectedTool,
  onToolSelect,
  className,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        "bg-white border-2 border-slate-200 shadow-lg rounded-2xl p-2",
        "flex flex-row gap-2",
        "items-center justify-center",
        className
      )}
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.type;
        return (
          <button
            key={tool.type}
            onClick={() => onToolSelect(tool.type)}
            className={cn(
              "flex items-center justify-center transition-all duration-200",
              "w-11 h-11 rounded-xl relative group",
              "hover:scale-105 active:scale-95 touch-manipulation",
              isSelected
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
            title={tool.label}
            aria-label={tool.label}
            type="button"
          >
            <Icon className="w-5 h-5" />

            {/* Fixed Tooltip */}
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {tool.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
