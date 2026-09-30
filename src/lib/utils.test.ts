import { cn } from './utils';

describe('cn', () => {
  it('keeps text colour and type-scale size together', () => {
    expect(cn('bg-primary text-on-primary', 'h-9 px-4 text-body')).toBe(
      'bg-primary text-on-primary h-9 px-4 text-body',
    );
  });

  it('later utilities of the same group win', () => {
    expect(cn('text-body', 'text-h1')).toBe('text-h1');
    expect(cn('text-fg', 'text-danger')).toBe('text-danger');
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
