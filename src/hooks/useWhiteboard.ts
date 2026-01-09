// src/hooks/useWhiteboard.ts

import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import type { WhiteboardElement, ToolType, Point } from "@/types/whiteboard";

export function useWhiteboard() {
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolType>("pencil");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] =
    useState<WhiteboardElement | null>(null);

  const addElement = useCallback((element: WhiteboardElement) => {
    setElements((prev) => [...prev, element]);
  }, []);

  const updateElement = useCallback(
    (id: string, updates: Partial<WhiteboardElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
  }, []);

  const startDrawing = useCallback(
    (x: number, y: number) => {
      const newElement: WhiteboardElement = {
        id: nanoid(),
        type: selectedTool,
        x,
        y,
        color: selectedColor,
        strokeWidth,
        fontSize,
        fontFamily,
        ...(selectedTool === "pencil" && { points: [{ x, y }] }),
        ...(selectedTool === "text" && { text: "" }),
      };

      setCurrentElement(newElement);
      setIsDrawing(true);
    },
    [selectedTool, selectedColor, strokeWidth, fontSize, fontFamily]
  );

  const updateDrawing = useCallback(
    (x: number, y: number) => {
      if (!isDrawing || !currentElement) return;

      if (currentElement.type === "pencil") {
        setCurrentElement({
          ...currentElement,
          points: [...(currentElement.points || []), { x, y }],
        });
      } else if (
        ["rectangle", "circle", "arrow"].includes(currentElement.type)
      ) {
        setCurrentElement({
          ...currentElement,
          width: x - currentElement.x,
          height: y - currentElement.y,
        });
      }
    },
    [isDrawing, currentElement]
  );

  const finishDrawing = useCallback(() => {
    if (currentElement && currentElement.type !== "text") {
      addElement(currentElement);
      setCurrentElement(null);
    }
    setIsDrawing(false);
  }, [currentElement, addElement]);

  const addText = useCallback(
    (text: string, x: number, y: number) => {
      const textElement: WhiteboardElement = {
        id: nanoid(),
        type: "text",
        x,
        y,
        color: selectedColor,
        strokeWidth,
        text,
        fontSize,
        fontFamily,
      };
      addElement(textElement);
    },
    [selectedColor, strokeWidth, fontSize, fontFamily, addElement]
  );

  return {
    elements,
    setElements,
    selectedTool,
    setSelectedTool,
    selectedColor,
    setSelectedColor,
    strokeWidth,
    setStrokeWidth,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    isDrawing,
    currentElement,
    addElement,
    updateElement,
    deleteElement,
    clearCanvas,
    startDrawing,
    updateDrawing,
    finishDrawing,
    addText,
  };
}
