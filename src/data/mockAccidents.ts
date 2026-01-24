import { AccidentReport } from '@/types/accident';

export const mockAccidents: AccidentReport[] = [
  {
    id: '1',
    type: 'collision',
    severity: 'moderate',
    description: 'Two vehicles collided at the intersection. Minor injuries reported.',
    dateTime: new Date('2024-01-15T08:30:00'),
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'Broadway & 42nd Street, New York',
    status: 'verified',
    createdAt: new Date('2024-01-15T08:35:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
  },
  {
    id: '2',
    type: 'pedestrian',
    severity: 'severe',
    description: 'Pedestrian struck while crossing. Emergency services responded.',
    dateTime: new Date('2024-01-14T17:45:00'),
    latitude: 40.7580,
    longitude: -73.9855,
    address: 'Times Square, New York',
    status: 'verified',
    createdAt: new Date('2024-01-14T17:50:00'),
    updatedAt: new Date('2024-01-14T19:00:00'),
  },
  {
    id: '3',
    type: 'single-vehicle',
    severity: 'minor',
    description: 'Vehicle skidded on wet road and hit a barrier. No injuries.',
    dateTime: new Date('2024-01-16T06:15:00'),
    latitude: 40.7489,
    longitude: -73.9680,
    address: 'East River Drive, New York',
    status: 'pending',
    createdAt: new Date('2024-01-16T06:20:00'),
    updatedAt: new Date('2024-01-16T06:20:00'),
  },
  {
    id: '4',
    type: 'multi-vehicle',
    severity: 'fatal',
    description: 'Multi-vehicle pileup on highway. Multiple casualties.',
    dateTime: new Date('2024-01-10T22:00:00'),
    latitude: 40.6892,
    longitude: -74.0445,
    address: 'Brooklyn-Battery Tunnel',
    status: 'resolved',
    createdAt: new Date('2024-01-10T22:05:00'),
    updatedAt: new Date('2024-01-12T14:00:00'),
  },
  {
    id: '5',
    type: 'cyclist',
    severity: 'moderate',
    description: 'Cyclist hit by turning vehicle. Cyclist transported to hospital.',
    dateTime: new Date('2024-01-17T09:30:00'),
    latitude: 40.7829,
    longitude: -73.9654,
    address: 'Central Park West, New York',
    status: 'verified',
    createdAt: new Date('2024-01-17T09:35:00'),
    updatedAt: new Date('2024-01-17T11:00:00'),
  },
  {
    id: '6',
    type: 'hit-and-run',
    severity: 'severe',
    description: 'Hit and run incident. Vehicle fled scene. Investigation ongoing.',
    dateTime: new Date('2024-01-13T23:15:00'),
    latitude: 40.7282,
    longitude: -73.7949,
    address: 'Queens Boulevard, Queens',
    status: 'pending',
    createdAt: new Date('2024-01-13T23:20:00'),
    updatedAt: new Date('2024-01-13T23:20:00'),
  },
  {
    id: '7',
    type: 'rollover',
    severity: 'severe',
    description: 'SUV rollover on exit ramp. Driver extracted by firefighters.',
    dateTime: new Date('2024-01-12T14:20:00'),
    latitude: 40.8176,
    longitude: -73.9419,
    address: 'Cross Bronx Expressway, Bronx',
    status: 'resolved',
    createdAt: new Date('2024-01-12T14:25:00'),
    updatedAt: new Date('2024-01-13T09:00:00'),
  },
  {
    id: '8',
    type: 'collision',
    severity: 'minor',
    description: 'Fender bender at traffic light. No injuries, minor damage.',
    dateTime: new Date('2024-01-18T11:45:00'),
    latitude: 40.5795,
    longitude: -74.1502,
    address: 'Hylan Boulevard, Staten Island',
    status: 'pending',
    createdAt: new Date('2024-01-18T11:50:00'),
    updatedAt: new Date('2024-01-18T11:50:00'),
  },
];

export const getAccidentStats = () => {
  const total = mockAccidents.length;
  const bySeverity = {
    minor: mockAccidents.filter(a => a.severity === 'minor').length,
    moderate: mockAccidents.filter(a => a.severity === 'moderate').length,
    severe: mockAccidents.filter(a => a.severity === 'severe').length,
    fatal: mockAccidents.filter(a => a.severity === 'fatal').length,
  };
  const byStatus = {
    pending: mockAccidents.filter(a => a.status === 'pending').length,
    verified: mockAccidents.filter(a => a.status === 'verified').length,
    resolved: mockAccidents.filter(a => a.status === 'resolved').length,
  };
  const byType = mockAccidents.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { total, bySeverity, byStatus, byType };
};
