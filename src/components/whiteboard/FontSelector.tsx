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
    <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-lg">
      <span className="text-xs font-semibold text-slate-600 px-2 hidden sm:inline">
        Font
      </span>

      {/* Font Family Selector */}
      <select
        value={fontFamily}
        onChange={(e) => onFontFamilyChange(e.target.value)}
        className="px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-700 font-medium cursor-pointer transition-all hover:border-slate-300"
        aria-label="Select font family"
      >
        {fonts.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>

      {/* Font Size Selector */}
      <select
        value={fontSize}
        onChange={(e) => onFontSizeChange(Number(e.target.value))}
        className="px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-700 font-medium cursor-pointer transition-all hover:border-slate-300"
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
