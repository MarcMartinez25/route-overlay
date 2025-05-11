import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Position, Size } from './types';

export const useRouteOverlay = (gpsData: { lat: number; lng: number }[]) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ width: 300, height: 300 });
  const [routeImage, setRouteImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0.7);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gpsData.length > 0) {
      generateRouteImage();
    }
  }, [gpsData]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setSize({
        width: size.width * scaleFactor,
        height: size.height * scaleFactor,
      });
    };

    overlay.addEventListener('wheel', handleWheel, { passive: false });
    return () => overlay.removeEventListener('wheel', handleWheel);
  }, [size.width, size.height]);

  const generateRouteImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    const bounds = gpsData.reduce(
      (acc, point) => ({
        minLat: Math.min(acc.minLat, point.lat),
        maxLat: Math.max(acc.maxLat, point.lat),
        minLng: Math.min(acc.minLng, point.lng),
        maxLng: Math.max(acc.maxLng, point.lng),
      }),
      {
        minLat: Infinity,
        maxLat: -Infinity,
        minLng: Infinity,
        maxLng: -Infinity,
      }
    );

    // Add padding to the bounds to ensure the route is fully visible
    const padding = 0.1; // 10% padding
    const routeWidth = bounds.maxLng - bounds.minLng;
    const routeHeight = bounds.maxLat - bounds.minLat;
    
    // Add padding to the bounds
    bounds.minLng -= routeWidth * padding;
    bounds.maxLng += routeWidth * padding;
    bounds.minLat -= routeHeight * padding;
    bounds.maxLat += routeHeight * padding;

    // Recalculate route dimensions with padding
    const paddedRouteWidth = bounds.maxLng - bounds.minLng;
    const paddedRouteHeight = bounds.maxLat - bounds.minLat;
    const routeAspectRatio = paddedRouteWidth / paddedRouteHeight;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    if (routeAspectRatio > 1) {
      drawHeight = drawWidth / routeAspectRatio;
    } else {
      drawWidth = drawHeight * routeAspectRatio;
    }

    const xOffset = (canvas.width - drawWidth) / 2;
    const yOffset = (canvas.height - drawHeight) / 2;

    const points = gpsData.map((point) => ({
      x: xOffset + ((point.lng - bounds.minLng) / paddedRouteWidth) * drawWidth,
      y: yOffset + ((bounds.maxLat - point.lat) / paddedRouteHeight) * drawHeight,
    }));

    ctx.strokeStyle = '#fc4c02';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    setRouteImage(canvas.toDataURL('image/png'));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!overlayRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleExport = async () => {
    if (!containerRef.current) return;

    try {
      const dataUrl = await toPng(containerRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = 'running-route-overlay.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  return {
    position,
    size,
    routeImage,
    isDragging,
    containerRef,
    overlayRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleExport,
    opacity,
    setOpacity,
  };
}; 