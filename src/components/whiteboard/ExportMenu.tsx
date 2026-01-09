// src/components/whiteboard/ExportMenu.tsx

"use client";

import { useState } from "react";
import { Download, FileImage, Code } from "lucide-react";
import Button from "@/components/ui/Button";
import { downloadCanvas, generateSVG, downloadSVG } from "@/lib/utils";
import type { WhiteboardElement } from "@/types/whiteboard";

interface ExportMenuProps {
  elements: WhiteboardElement[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  whiteboardName: string;
}

export default function ExportMenu({
  elements,
  canvasRef,
  whiteboardName,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportPNG = () => {
    if (canvasRef.current) {
      downloadCanvas(canvasRef.current, whiteboardName, "png");
    }
    setIsOpen(false);
  };

  const handleExportSVG = () => {
    if (canvasRef.current) {
      const svg = generateSVG(
        elements,
        canvasRef.current.width,
        canvasRef.current.height
      );
      downloadSVG(svg, whiteboardName);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border-2 border-slate-200 py-2 z-20 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Export Options
              </p>
            </div>

            <button
              onClick={handleExportPNG}
              className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileImage className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">PNG Image</p>
                <p className="text-xs text-slate-500">Raster format</p>
              </div>
            </button>

            <button
              onClick={handleExportSVG}
              className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Code className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">SVG Vector</p>
                <p className="text-xs text-slate-500">Scalable format</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
