import { cn } from '@/lib/utils';
import { SeverityLevel } from '@/types/accident';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

const severityConfig: Record<SeverityLevel, { label: string; className: string }> = {
  minor: {
    label: 'Minor',
    className: 'bg-severity-minor text-white',
  },
  moderate: {
    label: 'Moderate',
    className: 'bg-severity-moderate text-white',
  },
  severe: {
    label: 'Severe',
    className: 'bg-severity-severe text-white',
  },
  fatal: {
    label: 'Fatal',
    className: 'bg-severity-fatal text-white',
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
