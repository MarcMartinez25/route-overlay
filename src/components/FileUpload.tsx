'use client';

import { useState, useCallback } from 'react';

interface FileUploadProps {
  onGpsDataReceived: (data: { lat: number; lng: number }[]) => void;
  onBackgroundImageReceived: (imageUrl: string) => void;
}

export default function FileUpload({ onGpsDataReceived, onBackgroundImageReceived }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [gpxFileName, setGpxFileName] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const processGpxFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlDoc = new DOMParser().parseFromString(e.target?.result as string, 'text/xml');
      const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt'));
      
      const gpsData = trackPoints.map(point => ({
        lat: parseFloat(point.getAttribute('lat') || '0'),
        lng: parseFloat(point.getAttribute('lon') || '0'),
      })).filter(point => point.lat !== 0 && point.lng !== 0);

      onGpsDataReceived(gpsData);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  }, [onGpsDataReceived]);

  const processFitFile = useCallback((file: File) => {
    // For now, we'll show a message that FIT files are not supported
    alert('FIT file support coming soon! Please use GPX files for now.');
    setIsProcessing(false);
  }, []);

  const handleGpsFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setGpxFileName(file.name);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'fit') {
      processFitFile(file);
    } else if (fileExtension === 'gpx') {
      processGpxFile(file);
    } else {
      alert('Please upload a .fit or .gpx file');
      setIsProcessing(false);
      setGpxFileName(null);
    }
  }, [processFitFile, processGpxFile]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      onBackgroundImageReceived(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onBackgroundImageReceived]);

  const handleClear = useCallback(() => {
    onGpsDataReceived([]);
    onBackgroundImageReceived('');
    setGpxFileName(null);
    setImageFileName(null);
    setIsProcessing(false);
  }, [onGpsDataReceived, onBackgroundImageReceived]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload GPS File (.gpx)
        </label>
        <input
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
          onClick={handleClear}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
} 