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
];

export default function ColorPicker({
  selectedColor,
  onColorSelect,
}: ColorPickerProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all border-2",
              selectedColor === color
                ? "border-gray-900 scale-110"
                : "border-gray-300 hover:scale-105"
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
