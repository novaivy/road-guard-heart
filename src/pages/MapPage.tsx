import { Layout } from '@/components/layout/Layout';
import { AccidentMap } from '@/components/map/AccidentMap';
import { MapLegend } from '@/components/map/MapLegend';
import { mockAccidents } from '@/data/mockAccidents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { SeverityLevel, ReportStatus } from '@/types/accident';
import { Label } from '@/components/ui/label';

const MapPage = () => {
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');

  const filteredAccidents = mockAccidents.filter((accident) => {
    if (severityFilter !== 'all' && accident.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && accident.status !== statusFilter) return false;
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Accident Map</h1>
          <p className="text-muted-foreground">
            Interactive map showing all reported accidents. Click markers for details.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as SeverityLevel | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="All severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                      <SelectItem value="fatal">Fatal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-muted-foreground">
                  Showing {filteredAccidents.length} of {mockAccidents.length} accidents
                </p>
              </CardContent>
            </Card>

            {/* Legend */}
            <MapLegend />
          </div>

          {/* Map */}
          <Card className="lg:col-span-3 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle>Reported Accidents</CardTitle>
              <CardDescription>
                Hover over markers to see accident details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AccidentMap
                accidents={filteredAccidents}
                className="h-[600px] rounded-b-xl"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
