// src/lib/utils.ts

import { nanoid } from "nanoid";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateRoomCode(): string {
  return nanoid(10).toUpperCase();
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return d.toLocaleDateString();
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: "png" | "svg"
) {
  if (format === "png") {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

export function generateSVG(
  elements: any[],
  width: number,
  height: number
): string {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

  elements.forEach((element) => {
    if (element.type === "rectangle") {
      svg += `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="none" stroke="${element.color}" stroke-width="${element.strokeWidth}" />`;
    } else if (element.type === "circle") {
      const radius =
        Math.sqrt(Math.pow(element.width, 2) + Math.pow(element.height, 2)) / 2;
      svg += `<circle cx="${element.x + element.width / 2}" cy="${
        element.y + element.height / 2
      }" r="${radius}" fill="none" stroke="${element.color}" stroke-width="${
        element.strokeWidth
      }" />`;
    } else if (element.type === "pencil" && element.points) {
      const pathData = element.points
        .map((p: any, i: number) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");
      svg += `<path d="${pathData}" fill="none" stroke="${element.color}" stroke-width="${element.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
    } else if (element.type === "arrow") {
      svg += `<line x1="${element.x}" y1="${element.y}" x2="${
        element.x + element.width
      }" y2="${element.y + element.height}" stroke="${
        element.color
      }" stroke-width="${element.strokeWidth}" marker-end="url(#arrowhead-${
        element.id
      })" />`;
      svg += `<defs><marker id="arrowhead-${element.id}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="${element.color}" /></marker></defs>`;
    } else if (element.type === "text") {
      svg += `<text x="${element.x}" y="${element.y}" font-family="${element.fontFamily}" font-size="${element.fontSize}" fill="${element.color}">${element.text}</text>`;
    }
  });

  svg += "</svg>";
  return svg;
}

export function downloadSVG(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
