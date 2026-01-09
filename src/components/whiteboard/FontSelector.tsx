// src/components/whiteboard/FontSelector.tsx

"use client";

interface FontSelectorProps {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
}

const fonts = ["Arial", "Georgia", "Courier New", "Comic Sans MS", "Impact"];
const sizes = [8, 12, 16, 24, 32, 48, 64, 72];

export default function FontSelector({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
}: FontSelectorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Font
          </label>
          <select
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-0">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Size
          </label>
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
