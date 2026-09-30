import { type ReactNode } from 'react';

/** Page header: title (+ description) and at most one primary action on the end side (02 §3). */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 pb-6">
      <div className="grid gap-1">
        <h1 className="text-h1 font-semibold text-fg">{title}</h1>
        {description ? <p className="text-body text-fg-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
