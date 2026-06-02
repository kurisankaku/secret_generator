import type { LucideIcon } from 'lucide-react';

type TrustBadgeProps = {
  icon: LucideIcon;
  label: string;
  description: string;
};

export function TrustBadge({ icon: Icon, label, description }: TrustBadgeProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
    </div>
  );
}
