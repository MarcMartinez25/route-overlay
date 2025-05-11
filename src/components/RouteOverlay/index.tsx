'use client';

import { RouteOverlayProps } from './types';
import { useRouteOverlay } from './useRouteOverlay';

export default function RouteOverlay({ gpsData, backgroundImage }: RouteOverlayProps) {
  const {
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
  } = useRouteOverlay(gpsData);

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
              style={{ opacity }}
              draggable={false}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">
            Route Opacity: {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            id="opacity"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

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