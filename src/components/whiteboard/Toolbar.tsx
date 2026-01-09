// src/components/whiteboard/Toolbar.tsx

"use client";

import { Pencil, Square, Circle, ArrowRight, Type, Eraser } from "lucide-react";
import type { ToolType } from "@/types/whiteboard";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

const tools = [
  { type: "pencil" as ToolType, icon: Pencil, label: "Pencil" },
  { type: "rectangle" as ToolType, icon: Square, label: "Rectangle" },
  { type: "circle" as ToolType, icon: Circle, label: "Circle" },
  { type: "arrow" as ToolType, icon: ArrowRight, label: "Arrow" },
  { type: "text" as ToolType, icon: Type, label: "Text" },
  { type: "eraser" as ToolType, icon: Eraser, label: "Eraser" },
];

export default function Toolbar({ selectedTool, onToolSelect }: ToolbarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.type}
              onClick={() => onToolSelect(tool.type)}
              className={cn(
                "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all",
                selectedTool === tool.type
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              title={tool.label}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
