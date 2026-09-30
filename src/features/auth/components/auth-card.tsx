import { type ReactNode } from 'react';

export function AuthHeading({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="grid gap-2 pb-6">
      <h1 className="text-h1 font-semibold">{title}</h1>
      {description ? <p className="text-body text-fg-muted">{description}</p> : null}
    </div>
  );
}
