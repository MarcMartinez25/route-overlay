export interface GpsData {
  lat: number;
  lng: number;
}

export const processGpxFile = (file: File): Promise<GpsData[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlDoc = new DOMParser().parseFromString(e.target?.result as string, 'text/xml');
      const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt'));
      
      const gpsData = trackPoints.map(point => ({
        lat: parseFloat(point.getAttribute('lat') || '0'),
        lng: parseFloat(point.getAttribute('lon') || '0'),
      })).filter(point => point.lat !== 0 && point.lng !== 0);

      resolve(gpsData);
    };
    reader.readAsText(file);
  });
};

export const processFitFile = (file: File): Promise<never> => {
  return new Promise((_, reject) => {
    reject(new Error('FIT file support coming soon! Please use GPX files for now.'));
  });
};

export const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
}; 