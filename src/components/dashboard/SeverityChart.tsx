import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SeverityChartProps {
  data: {
    minor: number;
    moderate: number;
    severe: number;
    fatal: number;
  };
}

const COLORS = {
  minor: 'hsl(142 71% 45%)',
  moderate: 'hsl(38 92% 50%)',
  severe: 'hsl(25 95% 53%)',
  fatal: 'hsl(0 72% 40%)',
};

export function SeverityChart({ data }: SeverityChartProps) {
  const chartData = [
    { name: 'Minor', value: data.minor, color: COLORS.minor },
    { name: 'Moderate', value: data.moderate, color: COLORS.moderate },
    { name: 'Severe', value: data.severe, color: COLORS.severe },
    { name: 'Fatal', value: data.fatal, color: COLORS.fatal },
  ].filter(item => item.value > 0);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Severity Distribution</CardTitle>
        <CardDescription>Breakdown of accidents by severity level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
