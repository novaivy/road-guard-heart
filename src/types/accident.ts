export type SeverityLevel = 'minor' | 'moderate' | 'severe' | 'fatal';

export type AccidentType = 
  | 'collision'
  | 'rollover'
  | 'pedestrian'
  | 'cyclist'
  | 'hit-and-run'
  | 'multi-vehicle'
  | 'single-vehicle'
  | 'other';

export type ReportStatus = 'pending' | 'verified' | 'resolved';

export interface AccidentReport {
  id: string;
  type: AccidentType;
  severity: SeverityLevel;
  description: string;
  dateTime: Date;
  latitude: number;
  longitude: number;
  address?: string;
  images?: string[];
  reporterName?: string;
  reporterContact?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccidentFormData {
  type: AccidentType;
  severity: SeverityLevel;
  description: string;
  dateTime: string;
  latitude: number;
  longitude: number;
  address?: string;
  reporterName?: string;
  reporterContact?: string;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  type: AccidentType;
  dateTime: Date;
  description: string;
}
