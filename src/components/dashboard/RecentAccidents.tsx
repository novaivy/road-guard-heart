import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccidentReport } from '@/types/accident';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import { MapPin, Clock } from 'lucide-react';

interface RecentAccidentsProps {
  accidents: AccidentReport[];
}

export function RecentAccidents({ accidents }: RecentAccidentsProps) {
  const recentAccidents = [...accidents]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>Latest accident reports submitted</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAccidents.map((accident, index) => (
          <div
            key={accident.id}
            className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50 animate-slide-in-right"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <SeverityBadge severity={accident.severity} />
                <StatusBadge status={accident.status} />
              </div>
              <p className="text-sm font-medium line-clamp-2">{accident.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {accident.address || `${accident.latitude.toFixed(4)}, ${accident.longitude.toFixed(4)}`}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(accident.dateTime, 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
