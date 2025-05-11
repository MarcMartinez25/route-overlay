'use client';

import { useState, useCallback, useRef } from 'react';
import { GpsData } from './helpers';
import { createHandlers } from './handlers';

interface FileUploadProps {
  onGpsDataReceived: (data: GpsData[]) => void;
  onBackgroundImageReceived: (imageUrl: string) => void;
}

export default function FileUpload({ onGpsDataReceived, onBackgroundImageReceived }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [gpxFileName, setGpxFileName] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const gpsFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const { handleGpsFileUpload, handleImageUpload, handleClear } = createHandlers({
    onGpsDataReceived,
    onBackgroundImageReceived,
    setIsProcessing,
    setGpxFileName,
    setImageFileName,
  });

  const handleClearAll = () => {
    handleClear();
    if (gpsFileInputRef.current) {
      gpsFileInputRef.current.value = '';
    }
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload GPS File (.gpx)
        </label>
        <input
          ref={gpsFileInputRef}
          type="file"
          accept=".gpx,.fit"
          onChange={handleGpsFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isProcessing}
        />
        {gpxFileName && (
          <p className="mt-1 text-sm text-gray-600">
            Current file: {gpxFileName}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Note: FIT file support coming soon. Please use GPX files for now.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Background Image
        </label>
        <input
          ref={imageFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {imageFileName && (
          <p className="mt-1 text-sm text-gray-600">
            Current file: {imageFileName}
          </p>
        )}
      </div>

      {isProcessing && (
        <div className="text-sm text-gray-500 animate-pulse">
          Processing GPS data...
        </div>
      )}

      {(gpxFileName || imageFileName) && (
        <button
          onClick={handleClearAll}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
} 