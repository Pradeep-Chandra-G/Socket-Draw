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
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Export</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <button
              onClick={handleExportPNG}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
            >
              <FileImage className="w-4 h-4" />
              Export as PNG
            </button>
            <button
              onClick={handleExportSVG}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
            >
              <Code className="w-4 h-4" />
              Export as SVG
            </button>
          </div>
        </>
      )}
    </div>
  );
}
