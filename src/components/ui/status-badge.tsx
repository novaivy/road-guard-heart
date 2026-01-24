import { cn } from '@/lib/utils';
import { ReportStatus } from '@/types/accident';
import { Clock, CheckCircle, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const statusConfig: Record<ReportStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: {
    label: 'Pending',
    className: 'bg-status-pending/20 text-amber-700 border-status-pending',
    icon: Clock,
  },
  verified: {
    label: 'Verified',
    className: 'bg-status-verified/20 text-green-700 border-status-verified',
    icon: CheckCircle,
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-status-resolved/20 text-blue-700 border-status-resolved',
    icon: Archive,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
