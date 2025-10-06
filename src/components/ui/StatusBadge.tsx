import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'service' | 'standby' | 'maintenance' | 'ibl' | 'online' | 'offline' | 'warning';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'service':
        return { label: 'In Service', variant: 'default' as const, color: 'bg-green-500' };
      case 'standby':
        return { label: 'Standby', variant: 'secondary' as const, color: 'bg-blue-500' };
      case 'maintenance':
        return { label: 'Maintenance', variant: 'outline' as const, color: 'bg-orange-500' };
      case 'ibl':
        return { label: 'IBL', variant: 'destructive' as const, color: 'bg-red-500' };
      case 'online':
        return { label: 'Online', variant: 'default' as const, color: 'bg-green-500' };
      case 'offline':
        return { label: 'Offline', variant: 'destructive' as const, color: 'bg-red-500' };
      case 'warning':
        return { label: 'Warning', variant: 'outline' as const, color: 'bg-yellow-500' };
      default:
        return { label: status, variant: 'secondary' as const, color: 'bg-gray-500' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('w-2 h-2 rounded-full', config.color)} />
      <Badge variant={config.variant}>{config.label}</Badge>
    </div>
  );
}