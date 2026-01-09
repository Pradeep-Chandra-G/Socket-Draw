// src/components/whiteboard/Canvas.tsx

"use client";

import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { WhiteboardElement } from "@/types/whiteboard";

interface CanvasProps {
  elements: WhiteboardElement[];
  currentElement: WhiteboardElement | null;
  selectedTool: string;
  onStartDrawing: (x: number, y: number) => void;
  onUpdateDrawing: (x: number, y: number) => void;
  onFinishDrawing: (element?: WhiteboardElement) => void;
  onAddText: (text: string, x: number, y: number) => void;
  onCursorMove?: (x: number, y: number) => void;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  (
    {
      elements,
      currentElement,
      selectedTool,
      onStartDrawing,
      onUpdateDrawing,
      onFinishDrawing,
      onAddText,
      onCursorMove,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [textInput, setTextInput] = useState<{
      x: number;
      y: number;
      show: boolean;
    }>({
      x: 0,
      y: 0,
      show: false,
    });
    const [textValue, setTextValue] = useState("");

    useImperativeHandle(ref, () => canvasRef.current!);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (!parent) return;

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      };

      const preventTouch = (e: TouchEvent) => {
        e.preventDefault();
      };

      canvas.addEventListener("touchstart", preventTouch, { passive: false });
      canvas.addEventListener("touchmove", preventTouch, { passive: false });

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        canvas.removeEventListener("touchstart", preventTouch);
        canvas.removeEventListener("touchmove", preventTouch);
      };
    }, []);

    useEffect(() => {
      redraw();
    }, [elements, currentElement]);

    const redraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      [...elements, currentElement].filter(Boolean).forEach((element) => {
        if (!element) return;
        drawElement(ctx, element);
      });
    };

    const drawElement = (
      ctx: CanvasRenderingContext2D,
      element: WhiteboardElement
    ) => {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      switch (element.type) {
        case "pencil":
          if (!element.points || element.points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.stroke();
          break;

        case "rectangle":
          ctx.strokeRect(
            element.x,
            element.y,
            element.width || 0,
            element.height || 0
          );
          break;

        case "circle":
          const radius =
            Math.sqrt(
              Math.pow(element.width || 0, 2) + Math.pow(element.height || 0, 2)
            ) / 2;
          ctx.beginPath();
          ctx.arc(
            element.x + (element.width || 0) / 2,
            element.y + (element.height || 0) / 2,
            Math.abs(radius),
            0,
            2 * Math.PI
          );
          ctx.stroke();
          break;

        case "arrow":
          const endX = element.x + (element.width || 0);
          const endY = element.y + (element.height || 0);
          const angle = Math.atan2(endY - element.y, endX - element.x);
          const arrowLength = 15;

          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle - Math.PI / 6),
            endY - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle + Math.PI / 6),
            endY - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;

        case "text":
          ctx.font = `${element.fontSize}px ${element.fontFamily}`;
          ctx.fillStyle = element.color;
          ctx.fillText(element.text || "", element.x, element.y);
          break;
      }
    };

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getMousePos(e);

      if (selectedTool === "text") {
        setTextInput({ x, y, show: true });
        return;
      }

      onStartDrawing(x, y);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getMousePos(e);
      onUpdateDrawing(x, y);
      onCursorMove?.(x, y);
    };

    const handleMouseUp = () => {
      onFinishDrawing(currentElement || undefined);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
      const { x, y } = getTouchPos(e);

      if (selectedTool === "text") {
        setTextInput({ x, y, show: true });
        return;
      }

      onStartDrawing(x, y);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
      const { x, y } = getTouchPos(e);
      onUpdateDrawing(x, y);
      onCursorMove?.(x, y);
    };

    const handleTouchEnd = () => {
      onFinishDrawing(currentElement || undefined);
    };

    const handleTextSubmit = () => {
      if (textValue.trim()) {
        onAddText(textValue, textInput.x, textInput.y);
      }
      setTextInput({ x: 0, y: 0, show: false });
      setTextValue("");
    };

    return (
      <div className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full bg-white"
          style={{
            touchAction: "none",
            cursor: selectedTool === "text" ? "text" : "crosshair",
          }}
        />

        {textInput.show && (
          <div
            className="absolute z-10"
            style={{ left: textInput.x, top: textInput.y }}
          >
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTextSubmit();
                if (e.key === "Escape") {
                  setTextInput({ x: 0, y: 0, show: false });
                  setTextValue("");
                }
              }}
              onBlur={handleTextSubmit}
              autoFocus
              className="px-2 py-1 border-2 border-blue-500 rounded text-sm sm:text-base focus:outline-none"
              placeholder="Type text..."
            />
          </div>
        )}
      </div>
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
