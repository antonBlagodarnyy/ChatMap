export type IMarker = {
  markerId: number;
  position: { lat: number; lng: number };
  label: string;
  content: Node;
};
