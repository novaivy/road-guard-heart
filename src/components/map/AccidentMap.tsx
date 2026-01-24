import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AccidentReport, SeverityLevel } from '@/types/accident';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';

interface AccidentMapProps {
  accidents: AccidentReport[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const severityColors: Record<SeverityLevel, string> = {
  minor: '#22c55e',
  moderate: '#f59e0b',
  severe: '#f97316',
  fatal: '#b91c1c',
};

function createCustomIcon(severity: SeverityLevel) {
  const color = severityColors[severity];
  return L.divIcon({
    className: 'custom-marker-container',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 14px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

export function AccidentMap({
  accidents,
  center = [40.7128, -74.0060],
  zoom = 11,
  className,
}: AccidentMapProps) {
  return (
    <div className={`map-container ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        
        {accidents.map((accident) => (
          <Marker
            key={accident.id}
            position={[accident.latitude, accident.longitude]}
            icon={createCustomIcon(accident.severity)}
          >
            <Popup>
              <div className="min-w-[200px] space-y-2 p-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={accident.severity} />
                  <StatusBadge status={accident.status} />
                </div>
                <p className="font-medium text-sm capitalize">
                  {accident.type.replace('-', ' ')} Accident
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {accident.description}
                </p>
                <div className="text-xs text-muted-foreground border-t pt-2">
                  <p>{format(accident.dateTime, 'MMM d, yyyy h:mm a')}</p>
                  {accident.address && <p>{accident.address}</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
