// src/components/whiteboard/FontSelector.tsx

"use client";

interface FontSelectorProps {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
}

const fonts = ["Arial", "Georgia", "Courier New", "Comic Sans MS", "Impact"];
const sizes = [12, 16, 20, 24, 32, 48];

export default function FontSelector({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
}: FontSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={fontFamily}
        onChange={(e) => onFontFamilyChange(e.target.value)}
        className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        aria-label="Select font family"
      >
        {fonts.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>

      <select
        value={fontSize}
        onChange={(e) => onFontSizeChange(Number(e.target.value))}
        className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        aria-label="Select font size"
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
    </div>
  );
}
