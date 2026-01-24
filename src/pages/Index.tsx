import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { SeverityChart } from '@/components/dashboard/SeverityChart';
import { AccidentTypeChart } from '@/components/dashboard/AccidentTypeChart';
import { RecentAccidents } from '@/components/dashboard/RecentAccidents';
import { mockAccidents, getAccidentStats } from '@/data/mockAccidents';
import { AlertTriangle, TrendingUp, Clock, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AccidentMap } from '@/components/map/AccidentMap';

const Index = () => {
  const stats = getAccidentStats();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of road accident reports and analytics
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link to="/report">
            <Button className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Report New Accident
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              View Full Map
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Accidents"
            value={stats.total}
            icon={AlertTriangle}
            description="All time reports"
            iconClassName="bg-primary/10"
          />
          <StatCard
            title="Pending Review"
            value={stats.byStatus.pending}
            icon={Clock}
            description="Awaiting verification"
            iconClassName="bg-status-pending/20"
          />
          <StatCard
            title="Verified Reports"
            value={stats.byStatus.verified}
            icon={CheckCircle}
            description="Confirmed incidents"
            iconClassName="bg-status-verified/20"
          />
          <StatCard
            title="High Severity"
            value={stats.bySeverity.severe + stats.bySeverity.fatal}
            icon={TrendingUp}
            description="Severe & fatal cases"
            trend={{ value: 12, isPositive: true }}
            iconClassName="bg-destructive/20"
          />
        </div>

        {/* Map Preview */}
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Accident Hotspots</CardTitle>
              <CardDescription>Recent accident locations on the map</CardDescription>
            </div>
            <Link to="/map">
              <Button variant="outline" size="sm">
                View Full Map
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <AccidentMap accidents={mockAccidents} className="h-[300px] rounded-b-xl" />
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SeverityChart data={stats.bySeverity} />
          <AccidentTypeChart data={stats.byType} />
        </div>

        {/* Recent Accidents */}
        <RecentAccidents accidents={mockAccidents} />
      </div>
    </Layout>
  );
};

export default Index;
