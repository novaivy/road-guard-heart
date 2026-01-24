import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AccidentReport, SeverityLevel } from '@/types/accident';
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

const severityLabels: Record<SeverityLevel, string> = {
  minor: 'Minor',
  moderate: 'Moderate',
  severe: 'Severe',
  fatal: 'Fatal',
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

function createPopupContent(accident: AccidentReport): string {
  const color = severityColors[accident.severity];
  const label = severityLabels[accident.severity];
  const dateStr = format(accident.dateTime, 'MMM d, yyyy h:mm a');
  
  return `
    <div style="min-width: 200px; padding: 4px;">
      <div style="
        display: inline-block;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 600;
        color: white;
        background-color: ${color};
        margin-bottom: 8px;
      ">
        ${label}
      </div>
      <p style="font-weight: 500; font-size: 14px; text-transform: capitalize; margin: 0 0 4px 0;">
        ${accident.type.replace('-', ' ')} Accident
      </p>
      <p style="font-size: 13px; color: #666; margin: 0 0 8px 0;">
        ${accident.description}
      </p>
      <div style="font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 8px;">
        <p style="margin: 0;">${dateStr}</p>
        ${accident.address ? `<p style="margin: 4px 0 0 0;">${accident.address}</p>` : ''}
      </div>
    </div>
  `;
}

export function AccidentMap({
  accidents,
  center = [40.7128, -74.0060],
  zoom = 11,
  className,
}: AccidentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when accidents change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    accidents.forEach(accident => {
      const marker = L.marker([accident.latitude, accident.longitude], {
        icon: createCustomIcon(accident.severity),
      })
        .addTo(mapInstanceRef.current!)
        .bindPopup(createPopupContent(accident));

      markersRef.current.push(marker);
    });
  }, [accidents]);

  // Update center/zoom when props change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className={`map-container ${className || ''}`}>
      <div
        ref={mapRef}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
      />
    </div>
  );
}
