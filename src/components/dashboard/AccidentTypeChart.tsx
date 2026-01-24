import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AccidentTypeChartProps {
  data: Record<string, number>;
}

const typeLabels: Record<string, string> = {
  collision: 'Collision',
  rollover: 'Rollover',
  pedestrian: 'Pedestrian',
  cyclist: 'Cyclist',
  'hit-and-run': 'Hit & Run',
  'multi-vehicle': 'Multi-Vehicle',
  'single-vehicle': 'Single Vehicle',
  other: 'Other',
};

export function AccidentTypeChart({ data }: AccidentTypeChartProps) {
  const chartData = Object.entries(data).map(([type, count]) => ({
    type: typeLabels[type] || type,
    count,
  })).sort((a, b) => b.count - a.count);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Accidents by Type</CardTitle>
        <CardDescription>Distribution of accident types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                type="category"
                dataKey="type"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
