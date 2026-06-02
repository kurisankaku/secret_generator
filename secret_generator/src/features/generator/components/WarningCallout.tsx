import { AlertTriangle, Info } from 'lucide-react';

type WarningCalloutProps = {
  messages: readonly string[];
  tone?: 'info' | 'warning';
};

export function WarningCallout({ messages, tone = 'warning' }: WarningCalloutProps) {
  if (messages.length === 0) {
    return null;
  }

  const Icon = tone === 'warning' ? AlertTriangle : Info;
  const styles =
    tone === 'warning'
      ? 'border-warning/50 bg-warning/10 text-foreground'
      : 'border-primary/40 bg-primary/10 text-foreground';

  return (
    <div className={`rounded-lg border px-4 py-3 ${styles}`} role={tone === 'warning' ? 'note' : 'status'}>
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="space-y-1 text-sm">
          {messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
