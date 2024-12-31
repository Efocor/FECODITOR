//....ImageCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';
import { ImageState, Crop } from '../types';
import { toast } from 'react-hot-toast';
import { applyPixelation, applyNoise, applySharpen } from '../utils/imageProcessing';
import { adjustTemperature, adjustVibrance, adjustExposure } from '../utils/colorProcessing';

interface Props {
  image: string;
  filters: ImageState;
  crop: Crop | null;
  zoom: number;
  isCropping: boolean;
  onCropComplete: (crop: Crop) => void;
  rotation: number;          //....grados
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export const ImageCanvas: React.FC<Props> = ({
  image,
  filters,
  crop,
  zoom,
  isCropping,
  onCropComplete,
  rotation,
  flipHorizontal,
  flipVertical,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  //....Estados para manejar la selección de crop
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      //....Guardar el estado actual del contexto
      ctx.save();

      //....Resetear transformaciones anteriores
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      //....Calcular rotación en radianes
      const radians = (rotation * Math.PI) / 180;

      //....Calcular dimensiones del canvas para evitar recortes
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));
      const width = img.width;
      const height = img.height;
      const rotatedWidth = width * cos + height * sin;
      const rotatedHeight = width * sin + height * cos;

      //....Ajustar el tamaño del canvas
      canvas.width = rotatedWidth * zoom;
      canvas.height = rotatedHeight * zoom;

      //....Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //....Aplicar transformaciones
      ctx.translate(canvas.width / 2, canvas.height / 2); //....Mover al centro
      ctx.rotate(radians);                                //....Rotar
      ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1); //....Voltear

      //....Aplicar filtros
      ctx.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
        blur(${filters.blur}px)
        sepia(${filters.sepia}%)
        grayscale(${filters.grayscale}%)
        hue-rotate(${filters.hueRotate}deg)
        opacity(${filters.opacity}%)
      `;

      //....Dibujar la imagen centrada
      ctx.drawImage(
        img,
        -width / 2 * zoom,
        -height / 2 * zoom,
        width * zoom,
        height * zoom
      );

      //....Restaurar el estado del contexto
      ctx.restore();

      //....Apply advanced filters
      if (filters.pixelate > 1) applyPixelation(ctx, filters.pixelate);
      if (filters.noise > 0) applyNoise(ctx, filters.noise);
      if (filters.sharpen > 0) applySharpen(ctx, filters.sharpen);
      if (filters.temperature !== 0 || filters.tint !== 0) {
        adjustTemperature(ctx, filters.temperature, filters.tint);
      }
      if (filters.vibrance !== 0) adjustVibrance(ctx, filters.vibrance);
      if (filters.exposure !== 0) adjustExposure(ctx, filters.exposure);

      //....Aplicar crop si hay uno seleccionado
      //....Dibujar la selección de crop si está en proceso
      if (isSelecting && selectionStart && selectionEnd) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); //....Resetear transformaciones
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.rect(selectionStart.x, selectionStart.y, selectionEnd.x - selectionStart.x, selectionEnd.y - selectionStart.y);
        ctx.stroke();
        ctx.restore();
      }
    };

    img.onerror = () => {
      console.error('Error al cargar la imagen');
      toast.error('Error al cargar la imagen. Por favor, intenta con otra.');
    };
  }, [image, filters, zoom, rotation, flipHorizontal, flipVertical, isSelecting, selectionStart, selectionEnd]);

  //....Manejadores de eventos para el crop
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isCropping) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isCropping || !isSelecting || !selectionStart) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelectionEnd({ x, y });
  };

  const handleMouseUp = () => {
    if (!isCropping || !isSelecting || !selectionStart || !selectionEnd) return;
    setIsSelecting(false);

    //....Calcular el área de recorte
    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    if (width < 10 || height < 10) {
      toast.error('Selección demasiado pequeña para recortar.');
      return;
    }

    //....Convertir las coordenadas al espacio original de la imagen
    const radians = (rotation * Math.PI) / 180;
    const zoomFactor = zoom;
    const centerX = canvasRef.current!.width / 2;
    const centerY = canvasRef.current!.height / 2;

    //....Invertir las transformaciones para obtener las coordenadas correctas
    const invRotation = -radians;
    const invScaleX = flipHorizontal ? -1 / zoomFactor : 1 / zoomFactor;
    const invScaleY = flipVertical ? -1 / zoomFactor : 1 / zoomFactor;

    const invTranslateX = (x - centerX) * invScaleX;
    const invTranslateY = (y - centerY) * invScaleY;

    const origX = invTranslateX * Math.cos(invRotation) - invTranslateY * Math.sin(invRotation) + (canvasRef.current!.width / (2 * zoomFactor));
    const origY = invTranslateX * Math.sin(invRotation) + invTranslateY * Math.cos(invRotation) + (canvasRef.current!.height / (2 * zoomFactor));

    //....Crear una nueva imagen recortada
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;

    const cropWidth = width / zoomFactor;
    const cropHeight = height / zoomFactor;

    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      croppedCtx.drawImage(
        img,
        origX,
        origY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      const croppedImage = croppedCanvas.toDataURL();
      onCropComplete({ x: origX, y: origY, width: cropWidth, height: cropHeight, image: croppedImage });
      //....Actualizar el estado de la imagen en App.tsx
      //....Asegúrate de manejar esto en el componente padre
    };
    img.onerror = () => {
      console.error('Error al cargar la imagen para recortar');
      toast.error('Error al recortar la imagen.');
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className={`max-w-full h-auto rounded-lg shadow-lg ${
        isCropping ? 'cursor-crosshair' : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};
