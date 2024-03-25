import { Pixel } from "../../interfaces/pixel.interface";

export const pixelsToPng = (canvas: HTMLCanvasElement, pixels: Map<number, Pixel>): string | undefined => {
  canvas = drawCanvasPixels(canvas, pixels);

  return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
};

export const drawCanvasPixels = (canvas: HTMLCanvasElement, pixels: Map<number, Pixel>): HTMLCanvasElement => {
  const context = canvas.getContext('2d');

  if (!context) {
    return canvas;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  const pixelSize = 1;

  pixels.forEach(pixel => {
    if (!pixel.colour) {
      return;
    }

    context.fillStyle = pixel.colour;
    context.fillRect(pixel.col*pixelSize, pixel.row*pixelSize, pixelSize, pixelSize);
  });

  return canvas;
};
