'use client';

import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';

interface RouteOverlayProps {
  gpsData: { lat: number; lng: number }[];
  backgroundImage: string;
}

export default function RouteOverlay({ gpsData, backgroundImage }: RouteOverlayProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 300, height: 300 });
  const [routeImage, setRouteImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Find bounds of GPS data
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

    // Calculate aspect ratio of the route
    const routeWidth = bounds.maxLng - bounds.minLng;
    const routeHeight = bounds.maxLat - bounds.minLat;
    const routeAspectRatio = routeWidth / routeHeight;

    // Calculate canvas dimensions while maintaining aspect ratio
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    if (routeAspectRatio > 1) {
      drawHeight = drawWidth / routeAspectRatio;
    } else {
      drawWidth = drawHeight * routeAspectRatio;
    }

    // Center the drawing
    const xOffset = (canvas.width - drawWidth) / 2;
    const yOffset = (canvas.height - drawHeight) / 2;

    // Scale points to canvas while maintaining aspect ratio
    const points = gpsData.map((point) => ({
      x: xOffset + ((point.lng - bounds.minLng) / routeWidth) * drawWidth,
      y: yOffset + ((bounds.maxLat - point.lat) / routeHeight) * drawHeight, // Invert Y coordinate
    }));

    // Draw route
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
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

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative border border-gray-200 rounded-lg overflow-hidden"
        style={{ width: '100%', height: '500px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background Image */}
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Route Overlay */}
        {routeImage && (
          <div
            ref={overlayRef}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
          >
            <img
              src={routeImage}
              alt="Route"
              className="w-full h-full object-contain"
              style={{ opacity: 0.7 }}
              draggable={false}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Tip: Use mouse wheel to resize the route overlay, click and drag to reposition it.
        </p>
        <button
          onClick={handleExport}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Export Image
        </button>
      </div>
    </div>
  );
} 