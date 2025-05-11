export interface RouteOverlayProps {
  gpsData: { lat: number; lng: number }[];
  backgroundImage: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} 