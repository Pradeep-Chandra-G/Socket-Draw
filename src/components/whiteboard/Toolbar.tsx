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
        "bg-white border border-gray-200 shadow-xl rounded-full sm:rounded-2xl p-2",
        "flex flex-row sm:flex-col gap-2 sm:gap-3",
        "items-center justify-center backdrop-blur-sm bg-white/90",
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
              "w-10 h-10 sm:w-11 sm:h-11 rounded-full sm:rounded-xl",
              "hover:scale-105 active:scale-95 touch-manipulation",
              isSelected
                ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
            title={tool.label}
            aria-label={tool.label}
            type="button"
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        );
      })}
    </div>
  );
}
