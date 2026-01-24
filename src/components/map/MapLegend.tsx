import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const legendItems = [
  { severity: 'Minor', color: 'bg-severity-minor', description: 'No injuries or minor injuries' },
  { severity: 'Moderate', color: 'bg-severity-moderate', description: 'Injuries requiring medical attention' },
  { severity: 'Severe', color: 'bg-severity-severe', description: 'Serious injuries or hospitalization' },
  { severity: 'Fatal', color: 'bg-severity-fatal', description: 'One or more fatalities' },
];

export function MapLegend() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Severity Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.severity} className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-full ${item.color} ring-2 ring-white shadow`} />
            <div>
              <p className="text-sm font-medium">{item.severity}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
