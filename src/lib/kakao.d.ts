export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        LatLngBounds: new () => { extend: (latlng: unknown) => void };
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number }
        ) => { setBounds: (bounds: unknown) => void };
        Marker: new (options: { position: unknown; map?: unknown }) => {
          setMap: (map: unknown | null) => void;
        };
        Polyline: new (options: {
          path: unknown[];
          strokeWeight?: number;
          strokeColor?: string;
          strokeOpacity?: number;
        }) => { setMap: (map: unknown | null) => void };
      };
    };
  }
}
