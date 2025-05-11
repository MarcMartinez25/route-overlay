'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import RouteOverlay from '../components/RouteOverlay';

export default function Home() {
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number }[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Running Route Overlay</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Upload Files</h2>
            <FileUpload
              onGpsDataReceived={setGpsData}
              onBackgroundImageReceived={setBackgroundImage}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Preview</h2>
            {backgroundImage && (
              <RouteOverlay
                gpsData={gpsData}
                backgroundImage={backgroundImage}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
