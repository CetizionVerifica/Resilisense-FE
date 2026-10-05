import { companyFieldOf, companySchema, EMPTY_COMPANY, toCreateBody } from './schemas';

const valid = {
  ...EMPTY_COMPANY,
  legalName: ' Acme GmbH ',
  sectorCode: 'automotive',
  sizeBand: 'large',
  country: 'DE',
  currency: 'EUR',
  fiscalYearStartMonth: '4',
};

describe('company form schema (M02 §4.1)', () => {
  it('requires the essentials', () => {
    const result = companySchema.safeParse(EMPTY_COMPANY);
    expect(result.success).toBe(false);
    const paths = result.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(['legalName', 'sectorCode', 'sizeBand', 'country', 'currency']));
  });

  it.each([
    ['employeeCount', '12a', 'companies:validation.wholeNumber'],
    ['website', 'acme.example', 'companies:validation.website'],
    ['sizeBand', 'huge', 'validation.required'],
  ])('rejects %s = %s', (field, value, message) => {
    const result = companySchema.safeParse({ ...valid, [field]: value });
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it('builds the API body: trims, nulls blanks, groups the address', () => {
    const body = toCreateBody(companySchema.parse({ ...valid, city: 'Stuttgart', employeeCount: '1200' }));
    expect(body).toMatchObject({
      legalName: 'Acme GmbH',
      displayName: 'Acme GmbH',
      registrationNo: null,
      employeeCount: 1200,
      fiscalYearStartMonth: 4,
      parentCompanyId: null,
      address: { line1: null, line2: null, city: 'Stuttgart', postalCode: null, state: null },
    });
    expect(toCreateBody(companySchema.parse(valid)).address).toBeNull();
  });

  it('maps server error paths to form fields', () => {
    expect(companyFieldOf('company.sectorCode')).toBe('sectorCode');
    expect(companyFieldOf('address.postalCode')).toBe('postalCode');
    expect(companyFieldOf('confirmName')).toBeNull();
  });
});
