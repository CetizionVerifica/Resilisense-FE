import { ContractChecker } from './contract';

/** The mock contract check must catch what it claims to catch (CI test plan A3). */
describe('ContractChecker', () => {
  const item = {
    type: 'object',
    additionalProperties: false,
    required: ['id', 'role'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      role: { nullable: true, type: 'string', enum: ['owner', 'viewer'] },
    },
  };
  const json = (schema: object) => ({ content: { 'application/json': { schema } } });
  const checker = new ContractChecker({
    paths: {
      '/v1/things/{id}': {
        get: { responses: { '200': json(item) } },
        patch: {
          requestBody: json({ type: 'object', required: ['role'], properties: { role: { type: 'string' } } }),
          responses: { '204': {} },
        },
      },
      '/v1/things/mine': { get: { responses: { '200': json({ type: 'array', items: item }) } } },
    },
  });
  const id = '01a107af-de53-7bdf-909f-651aa074d32f';
  const thing = `/v1/things/${id}`;
  const JSON_ = 'application/json';
  const PROBLEM = 'application/problem+json';
  const body = (value: unknown) => JSON.stringify(value);
  const problem = (status: number) =>
    body({ type: 'https://resilisense.org/problems/not_found', title: 'Not found', status });

  it.each([
    ['a documented body', 'GET', thing, 200, JSON_, body({ id, role: 'owner' })],
    ['null for a nullable enum', 'GET', thing, 200, JSON_, body({ id, role: null })],
    ['a literal path before a template', 'GET', '/v1/things/mine', 200, JSON_, body([])],
    ['a 204 without body', 'PATCH', thing, 204, '', ''],
    ['problem+json', 'GET', thing, 404, PROBLEM, problem(404)],
  ])('accepts %s', (_name, method, path, status, type, raw) => {
    expect(checker.checkResponse(method, path, status, type, raw)).toEqual([]);
  });

  it.each([
    ['an undocumented status', 'GET', thing, 201, JSON_, body({ id, role: null }), /documents 200/],
    ['a missing field', 'GET', thing, 200, JSON_, body({ id }), /required property 'role'/],
    ['an extra field', 'GET', thing, 200, JSON_, body({ id, role: null, x: 1 }), /additional properties/],
    ['a wrong enum value', 'GET', thing, 200, JSON_, body({ id, role: 'admin' }), /allowed values/],
    ['an operation missing from the contract', 'GET', '/v1/nope', 200, JSON_, body({}), /not in api\/openapi/],
    ['a plain JSON error', 'GET', thing, 500, JSON_, body({}), /problem\+json/],
    ['a problem status mismatch', 'GET', thing, 409, PROBLEM, problem(404), /differs/],
  ])('rejects %s', (_name, method, path, status, type, raw, message) => {
    const problems = checker.checkResponse(method, path, status, type, raw);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(message);
  });

  it('checks JSON request bodies against requestBody', () => {
    expect(checker.checkRequest('PATCH', thing, JSON_, body({ role: 'owner' }))).toEqual([]);
    expect(checker.checkRequest('PATCH', thing, JSON_, body({}))[0]).toMatch(
      /request body: .*required property 'role'/,
    );
    expect(checker.checkRequest('GET', thing, JSON_, body({ x: 1 }))[0]).toMatch(/does not define/);
  });
});
