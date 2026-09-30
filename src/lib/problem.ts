/** RFC 9457 problem details returned by the API (ADR-004). */
export interface Problem {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Array<{ path: string; message: string; code?: string }>;
  [extension: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly problem: Problem,
  ) {
    super(problem.title);
    this.name = 'ApiError';
  }

  /** Stable problem code, e.g. `invalid_token` from `https://resilisense.org/problems/invalid_token`. */
  get code(): string {
    return this.problem.type.split('/').pop() ?? 'unknown';
  }
}

export function isApiError(e: unknown, code?: string): e is ApiError {
  return e instanceof ApiError && (code === undefined || e.code === code);
}

export function toProblem(status: number, body: unknown): Problem {
  if (body && typeof body === 'object' && 'type' in body && 'title' in body) return body as Problem;
  return {
    type: `https://resilisense.org/problems/${status >= 500 ? 'internal_error' : 'unknown'}`,
    title: 'Request failed',
    status,
  };
}
