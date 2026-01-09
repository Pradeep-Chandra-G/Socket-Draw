// src/components/whiteboard/ColorPicker.tsx

"use client";

import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  "#000000", // Black
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFFFFF", // White
];

export default function ColorPicker({
  selectedColor,
  onColorSelect,
}: ColorPickerProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={cn(
            "w-7 h-7 sm:w-8 sm:h-8 rounded-md transition-all border-2 flex-shrink-0",
            selectedColor === color
              ? "border-blue-600 scale-110 ring-2 ring-blue-200"
              : "border-gray-300 hover:scale-105",
            color === "#FFFFFF" && "border-gray-400"
          )}
          style={{ backgroundColor: color }}
          title={color}
          aria-label={`Select ${color} color`}
        />
      ))}
    </div>
  );
}
