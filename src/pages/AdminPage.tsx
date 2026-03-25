import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAccidents, useUpdateAccident, type Accident } from '@/hooks/useAccidents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Shield, Navigation, Clock, CheckCircle, AlertTriangle, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const severityVariant: Record<string, string> = {
  minor: 'bg-severity-minor/20 text-severity-minor border-severity-minor/30',
  moderate: 'bg-severity-moderate/20 text-severity-moderate border-severity-moderate/30',
  severe: 'bg-severity-severe/20 text-severity-severe border-severity-severe/30',
  fatal: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-status-pending/20 text-status-pending' },
  verified: { label: 'Verified', icon: CheckCircle, className: 'bg-status-verified/20 text-status-verified' },
  dispatched: { label: 'Dispatched', icon: Navigation, className: 'bg-primary/20 text-primary' },
  resolved: { label: 'Resolved', icon: Shield, className: 'bg-muted text-muted-foreground' },
};

const AdminPage = () => {
  const { data: accidents, isLoading } = useAccidents();
  const updateAccident = useUpdateAccident();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(null);
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const filtered = accidents?.filter((a) =>
    statusFilter === 'all' ? true : a.status === statusFilter
  ) ?? [];

  const handleDispatch = async () => {
    if (!selectedAccident) return;
    try {
      await updateAccident.mutateAsync({
        id: selectedAccident.id,
        status: (newStatus || 'dispatched') as any,
        dispatch_notes: dispatchNotes || null,
        dispatched_at: newStatus === 'dispatched' ? new Date().toISOString() : selectedAccident.dispatched_at,
      });
      toast({
        title: 'Report updated',
        description: `Accident report has been marked as "${newStatus || 'dispatched'}".`,
      });
      setSelectedAccident(null);
      setDispatchNotes('');
      setNewStatus('');
    } catch {
      toast({ title: 'Update failed', description: 'Could not update the report.', variant: 'destructive' });
    }
  };

  const openDispatchDialog = (accident: Accident) => {
    setSelectedAccident(accident);
    setDispatchNotes(accident.dispatch_notes || '');
    setNewStatus(accident.status === 'pending' ? 'dispatched' : accident.status);
  };

  const pendingCount = accidents?.filter((a) => a.status === 'pending').length ?? 0;
  const dispatchedCount = accidents?.filter((a) => a.status === 'dispatched').length ?? 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            County Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Review accident reports and dispatch police officers to the scene.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-status-pending/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-status-pending">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review & dispatch</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Officers Dispatched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{dispatchedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active dispatches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{accidents?.length ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Accident Reports</CardTitle>
              <CardDescription>Click on a report to dispatch officers or update status</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No accident reports found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((accident) => {
                      const statusInfo = statusConfig[accident.status];
                      const StatusIcon = statusInfo.icon;
                      return (
                        <TableRow key={accident.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium text-sm">
                            {format(new Date(accident.date_time), 'MMM d, yyyy h:mm a')}
                          </TableCell>
                          <TableCell className="capitalize text-sm">
                            {accident.type.replace('-', ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={severityVariant[accident.severity]}>
                              {accident.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate">
                            {accident.address || `${accident.latitude.toFixed(4)}, ${accident.longitude.toFixed(4)}`}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${statusInfo.className} gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  window.open(
                                    `https://www.google.com/maps?q=${accident.latitude},${accident.longitude}`,
                                    '_blank'
                                  )
                                }
                              >
                                <MapPin className="h-3 w-3 mr-1" />
                                Map
                              </Button>
                              <Button size="sm" onClick={() => openDispatchDialog(accident)}>
                                <Navigation className="h-3 w-3 mr-1" />
                                {accident.status === 'pending' ? 'Dispatch' : 'Update'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dispatch Dialog */}
      <Dialog open={!!selectedAccident} onOpenChange={(open) => !open && setSelectedAccident(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              {selectedAccident?.status === 'pending' ? 'Dispatch Officers' : 'Update Report'}
            </DialogTitle>
            <DialogDescription>
              {selectedAccident?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedAccident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{' '}
                  <span className="capitalize font-medium">{selectedAccident.type.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Severity:</span>{' '}
                  <Badge variant="outline" className={severityVariant[selectedAccident.severity]}>
                    {selectedAccident.severity}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>{' '}
                  <span className="font-medium">{selectedAccident.address || 'Coordinates only'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reported:</span>{' '}
                  <span className="font-medium">
                    {format(new Date(selectedAccident.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${selectedAccident.latitude},${selectedAccident.longitude}`,
                    '_blank'
                  )
                }
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </Button>

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dispatch Notes</Label>
                <Textarea
                  placeholder="e.g., 2 patrol cars sent, ambulance requested..."
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAccident(null)}>
              Cancel
            </Button>
            <Button onClick={handleDispatch} disabled={updateAccident.isPending || !newStatus}>
              {updateAccident.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              {updateAccident.isPending ? 'Updating...' : 'Confirm & Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminPage;
