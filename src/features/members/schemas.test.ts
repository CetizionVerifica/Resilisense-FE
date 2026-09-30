import { csvRowCount, inviteSchema, MAX_INVITES, parseEmailList } from './schemas';

describe('parseEmailList', () => {
  it('splits on commas, semicolons and whitespace and de-duplicates case-insensitively', () => {
    expect(parseEmailList(' A@x.io, b@x.io;\n a@X.io\tc@x.io ,, ')).toEqual(['a@x.io', 'b@x.io', 'c@x.io']);
  });
});

describe('inviteSchema', () => {
  const parse = (emails: string) => inviteSchema.safeParse({ emails, role: 'viewer' });
  it('requires at least one valid address', () => {
    expect(parse('  ').success).toBe(false);
    expect(parse('a@x.io, nope').error?.issues[0]?.message).toBe('members:invite.invalidEmails');
    expect(parse('a@x.io b@x.io').success).toBe(true);
  });
  it(`caps a request at ${MAX_INVITES} addresses`, () => {
    const many = Array.from({ length: MAX_INVITES + 1 }, (_, i) => `u${i}@x.io`).join(',');
    expect(parse(many).error?.issues[0]?.message).toBe('members:invite.tooMany');
  });
});

describe('csvRowCount', () => {
  it('counts data rows, ignoring the header and blank lines', () => {
    expect(csvRowCount('email,role,company_ids,project_ids\r\na@x.io,viewer,,\n\nb@x.io,viewer,,\n')).toBe(2);
    expect(csvRowCount('')).toBe(0);
  });
});
