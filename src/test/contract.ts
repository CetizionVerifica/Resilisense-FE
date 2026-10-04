import Ajv, { type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import contract from '../../api/openapi.json';

/**
 * Mock contract check (CI test plan A3): every MSW response a test receives, and every JSON request
 * body the app sends, is checked against the pinned backend contract in api/openapi.json — the same
 * document the generated client comes from. A hand-written mock that returns a status, field or
 * shape the API does not, or a form that posts a body the API would reject, fails the test that
 * caused it (see setup.ts).
 *
 *  - 2xx: the status must be documented for the operation and the body must match its schema.
 *  - 4xx/5xx: the body must be RFC 9457 problem+json whose `status` equals the HTTP status.
 *  - Requests: JSON bodies must match the operation's `requestBody` schema.
 */

interface OpenApiDoc {
  paths: Record<string, Record<string, OperationObject | undefined>>;
  components?: { schemas?: Record<string, object> };
}

interface OperationObject {
  requestBody?: { content?: Record<string, { schema?: object }> };
  responses?: Record<string, { content?: Record<string, { schema?: object }> }>;
}

interface Operation {
  key: string;
  regex: RegExp;
  params: number;
  op: OperationObject;
}

const PROBLEM_TYPE_URI = /^https:\/\/resilisense\.org\/problems\/[a-z_]+$/;

const problemSchema = {
  type: 'object',
  required: ['type', 'title', 'status'],
  properties: {
    type: { type: 'string', pattern: PROBLEM_TYPE_URI.source },
    title: { type: 'string', minLength: 1 },
    status: { type: 'integer', minimum: 400, maximum: 599 },
    detail: { type: 'string' },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        required: ['path', 'message'],
        properties: { path: { type: 'string' }, message: { type: 'string' } },
      },
    },
  },
};

export class ContractChecker {
  private readonly ajv = new Ajv({ allErrors: true, strict: false });
  private readonly operations = new Map<string, Operation[]>();
  private readonly validators = new Map<string, ValidateFunction>();
  private readonly problem: ValidateFunction;

  constructor(source: OpenApiDoc) {
    const doc = allowNullInNullableEnums(structuredClone(source));
    addFormats(this.ajv);
    for (const [name, schema] of Object.entries(doc.components?.schemas ?? {}))
      this.ajv.addSchema(schema, `#/components/schemas/${name}`);
    this.problem = this.ajv.compile(problemSchema);
    for (const [path, item] of Object.entries(doc.paths)) {
      for (const [method, op] of Object.entries(item)) {
        if (!op?.responses) continue;
        const params = (path.match(/\{[^}]+\}/g) ?? []).length;
        const pattern = path.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{[^}]+\}/g, '[^/]+');
        const list = this.operations.get(method) ?? [];
        list.push({ key: `${method.toUpperCase()} ${path}`, regex: new RegExp(`^${pattern}/?$`), params, op });
        this.operations.set(method, list);
      }
    }
    // Literal segments win over templated ones (`/me/sessions` before `/me/{id}`).
    for (const list of this.operations.values()) list.sort((a, b) => a.params - b.params);
  }

  private find(method: string, path: string): Operation | undefined {
    return this.operations.get(method.toLowerCase())?.find((o) => o.regex.test(path));
  }

  private validate(key: string, schema: object, body: unknown): string | undefined {
    let fn = this.validators.get(key);
    if (!fn) {
      fn = this.ajv.compile(schema);
      this.validators.set(key, fn);
    }
    return fn(body) ? undefined : this.ajv.errorsText(fn.errors);
  }

  /** Contract problems of a JSON request body the app sent (empty when it conforms). */
  checkRequest(method: string, path: string, contentType: string, raw: string): string[] {
    const op = this.find(method, path);
    if (!op || !contentType.startsWith('application/json') || raw.length === 0) return [];
    const schema = op.op.requestBody?.content?.['application/json']?.schema;
    if (!schema) return [`${op.key} sends a JSON body the contract does not define`];
    const body = parseJson(raw);
    if (body === undefined) return [`${op.key} request body is not valid JSON`];
    const error = this.validate(`${op.key} request`, schema, body);
    return error ? [`${op.key} request body: ${error}`] : [];
  }

  /** Contract problems of one mocked response (empty when it conforms). */
  checkResponse(method: string, path: string, status: number, contentType: string, raw: string): string[] {
    if (status >= 400) {
      if (!contentType.startsWith('application/problem+json'))
        return [`error response is ${contentType || 'without content type'}, expected application/problem+json`];
      const body = parseJson(raw);
      if (body === undefined) return ['error body is not valid JSON'];
      if (!this.problem(body)) return [`problem+json: ${this.ajv.errorsText(this.problem.errors)}`];
      const bodyStatus = (body as { status: number }).status;
      return bodyStatus === status ? [] : [`problem status ${bodyStatus} differs from HTTP status ${status}`];
    }
    const op = this.find(method, path);
    if (!op) return [`${method} ${path} is mocked but not in api/openapi.json (run npm run api:sync?)`];
    const response = op.op.responses?.[String(status)];
    if (!response) {
      const documented = Object.keys(op.op.responses ?? {}).join(', ');
      return [`${op.key} mocked ${status}; the API documents ${documented}`];
    }
    const schema = response.content?.['application/json']?.schema;
    if (!schema)
      return raw.length === 0 ? [] : [`${op.key} ${status} has no body in the contract but the mock sends one`];
    if (!contentType.startsWith('application/json'))
      return [`${op.key} ${status} mock is ${contentType || 'without content type'}, the API sends application/json`];
    const body = parseJson(raw);
    if (body === undefined) return [`${op.key} ${status} mock body is not valid JSON`];
    const error = this.validate(`${op.key} ${status}`, schema, body);
    return error ? [`${op.key} ${status} mock body: ${error}`] : [];
  }
}

/**
 * OpenAPI 3.0 `nullable: true` does not add `null` to an `enum`, so Ajv would reject `null` for a
 * Zod `.nullable()` enum that the generated client types as `T | null`.
 */
function allowNullInNullableEnums<T>(node: T): T {
  if (Array.isArray(node)) node.forEach(allowNullInNullableEnums);
  else if (node && typeof node === 'object') {
    const schema = node as Record<string, unknown>;
    if (schema.nullable === true && Array.isArray(schema.enum) && !schema.enum.includes(null))
      schema.enum = [...(schema.enum as unknown[]), null];
    Object.values(schema).forEach(allowNullInNullableEnums);
  }
  return node;
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

export interface ContractViolation {
  request: string;
  problem: string;
}

let checker: ContractChecker | undefined;
let ignored = false;
const violations: ContractViolation[] = [];
const pending = new Set<Promise<void>>();

interface MockEvents {
  on(type: 'response:mocked', listener: (event: { request: Request; response: Response }) => void): unknown;
}

/** Checks every request/response pair MSW mocks for the API (`/v1/…`). */
export function recordContract(events: MockEvents): void {
  events.on('response:mocked', ({ request, response }) => {
    const { pathname } = new URL(request.url);
    if (ignored || !pathname.startsWith('/v1/')) return;
    checker ??= new ContractChecker(contract as unknown as OpenApiDoc);
    const label = `${request.method} ${pathname}`;
    const task = (async () => {
      const [requestBody, responseBody] = await Promise.all([
        request
          .clone()
          .text()
          .catch(() => ''),
        response.clone().text(),
      ]);
      const problems = [
        ...checker.checkRequest(request.method, pathname, request.headers.get('content-type') ?? '', requestBody),
        ...checker.checkResponse(
          request.method,
          pathname,
          response.status,
          response.headers.get('content-type') ?? '',
          responseBody,
        ),
      ];
      for (const problem of problems) violations.push({ request: `${label} → ${response.status}`, problem });
    })();
    pending.add(task);
    void task.finally(() => pending.delete(task));
  });
}

/**
 * Turns the check off for the current test only — for tests of the HTTP plumbing itself (the fetch
 * mutator against a made-up endpoint), never for feature tests.
 */
export function ignoreContract(): void {
  ignored = true;
}

/** Waits for in-flight checks, then returns and clears the violations recorded so far. */
export async function drainContractViolations(): Promise<ContractViolation[]> {
  await Promise.all(pending);
  ignored = false;
  return violations.splice(0);
}
