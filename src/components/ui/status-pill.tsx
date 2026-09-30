import { CheckCircle2, CircleDashed, Clock, MinusCircle, XCircle } from 'lucide-react';
import { Badge } from './badge';

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const ICONS = { success: CheckCircle2, warning: Clock, danger: XCircle, neutral: MinusCircle, info: CircleDashed };

/** Status as icon + label, never colour alone (02 §2.3). */
export function StatusPill({ tone, label }: { tone: StatusTone; label: string }) {
  const Icon = ICONS[tone];
  return (
    <Badge tone={tone} className="[&_svg]:size-3.5">
      <Icon aria-hidden />
      {label}
    </Badge>
  );
}
