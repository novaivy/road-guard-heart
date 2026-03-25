import { Layout } from '@/components/layout/Layout';
import { AccidentMap } from '@/components/map/AccidentMap';
import { MapLegend } from '@/components/map/MapLegend';
import { useAccidents } from '@/hooks/useAccidents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const MapPage = () => {
  const { data: accidents, isLoading } = useAccidents();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const mapAccidents = (accidents ?? [])
    .filter((a) => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    })
    .map((a) => ({
      id: a.id,
      type: a.type as any,
      severity: a.severity as any,
      description: a.description,
      dateTime: new Date(a.date_time),
      latitude: a.latitude,
      longitude: a.longitude,
      address: a.address ?? undefined,
      status: a.status as any,
      createdAt: new Date(a.created_at),
      updatedAt: new Date(a.updated_at),
    }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Accident Map</h1>
          <p className="text-muted-foreground">
            Interactive map showing all reported accidents. Click markers for details.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger><SelectValue placeholder="All severities" /></SelectTrigger>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing {mapAccidents.length} of {accidents?.length ?? 0} accidents
                </p>
              </CardContent>
            </Card>
            <MapLegend />
          </div>

          <Card className="lg:col-span-3 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle>Reported Accidents</CardTitle>
              <CardDescription>Hover over markers to see accident details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Skeleton className="h-[600px] w-full rounded-b-xl" />
              ) : (
                <AccidentMap accidents={mapAccidents} className="h-[600px] rounded-b-xl" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
