// src/components/whiteboard/ColorPicker.tsx

"use client";

import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  { value: "#000000", name: "Black" },
  { value: "#EF4444", name: "Red" },
  { value: "#10B981", name: "Green" },
  { value: "#3B82F6", name: "Blue" },
  { value: "#F59E0B", name: "Orange" },
  { value: "#8B5CF6", name: "Purple" },
  { value: "#EC4899", name: "Pink" },
  { value: "#6B7280", name: "Gray" },
];

export default function ColorPicker({
  selectedColor,
  onColorSelect,
}: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-lg">
      <span className="text-xs font-semibold text-slate-600 px-2 hidden sm:inline">
        Color
      </span>
      <div className="flex items-center gap-1.5">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={cn(
              "w-9 h-9 rounded-lg transition-all duration-200 border-2 flex-shrink-0 relative group",
              "hover:scale-110 active:scale-95",
              selectedColor === color.value
                ? "border-slate-900 scale-110 shadow-lg"
                : "border-slate-300 hover:border-slate-400"
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {/* Checkmark for selected color */}
            {selectedColor === color.value && (
              <svg
                className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}

            {/* Tooltip */}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
