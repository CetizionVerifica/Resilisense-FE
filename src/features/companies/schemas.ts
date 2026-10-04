import { z } from 'zod';
import {
  type CompaniesControllerCreateBody,
  type CompaniesControllerGet200,
  type CompaniesControllerUpdateBody,
} from '@/api/generated/model';

export const SIZE_BANDS = ['micro', 'small', 'medium', 'large'] as const;
export type SizeBand = (typeof SIZE_BANDS)[number];

const text = (max: number) => z.string().trim().max(max, 'companies:validation.tooLong');

/**
 * Company form (M02 §4.1: identity + profile). Inputs stay strings; `toCreateBody` /
 * `toUpdateBody` turn them into the API shape. The API validates again (sector, country).
 */
export const companySchema = z.object({
  legalName: z.string().trim().min(1, 'validation.required').max(200, 'companies:validation.tooLong'),
  displayName: text(120),
  registrationNo: text(64),
  sectorCode: z.string().min(1, 'validation.required'),
  // '' until chosen; a string keeps the form's input and output types equal for the resolver.
  sizeBand: z.string().refine((v) => (SIZE_BANDS as readonly string[]).includes(v), 'validation.required'),
  employeeCount: z
    .string()
    .trim()
    .regex(/^\d{0,8}$/, 'companies:validation.wholeNumber'),
  country: z.string().regex(/^[A-Z]{2}$/, 'validation.required'),
  region: text(120),
  website: z
    .string()
    .trim()
    .max(300, 'companies:validation.tooLong')
    .refine((v) => v === '' || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v), 'companies:validation.website'),
  description: text(2000),
  addressLine1: text(200),
  addressLine2: text(200),
  city: text(120),
  postalCode: text(32),
  state: text(120),
  fiscalYearStartMonth: z.string().regex(/^(1[0-2]|[1-9])$/, 'validation.required'),
  currency: z.string().regex(/^[A-Z]{3}$/, 'validation.required'),
  parentCompanyId: z.string(),
});
export type CompanyValues = z.infer<typeof companySchema>;

export const EMPTY_COMPANY: CompanyValues = {
  legalName: '',
  displayName: '',
  registrationNo: '',
  sectorCode: '',
  sizeBand: '',
  employeeCount: '',
  country: '',
  region: '',
  website: '',
  description: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  state: '',
  fiscalYearStartMonth: '1',
  currency: '',
  parentCompanyId: '',
};

const orNull = (v: string) => (v.trim() === '' ? null : v.trim());

function address(v: CompanyValues) {
  const a = {
    line1: orNull(v.addressLine1),
    line2: orNull(v.addressLine2),
    city: orNull(v.city),
    postalCode: orNull(v.postalCode),
    state: orNull(v.state),
  };
  return Object.values(a).some((x) => x !== null) ? a : null;
}

export function toCreateBody(v: CompanyValues): CompaniesControllerCreateBody {
  return {
    legalName: v.legalName.trim(),
    displayName: v.displayName.trim() || v.legalName.trim(),
    registrationNo: orNull(v.registrationNo),
    sectorCode: v.sectorCode,
    sizeBand: v.sizeBand as SizeBand,
    employeeCount: v.employeeCount ? Number(v.employeeCount) : null,
    country: v.country,
    region: orNull(v.region),
    website: orNull(v.website),
    description: orNull(v.description),
    address: address(v),
    fiscalYearStartMonth: Number(v.fiscalYearStartMonth),
    currency: v.currency,
    parentCompanyId: v.parentCompanyId || null,
  };
}

/** Every field is sent on update too (the form edits the whole profile). */
export function toUpdateBody(v: CompanyValues): CompaniesControllerUpdateBody {
  return toCreateBody(v);
}

export function toFormValues(c: CompaniesControllerGet200): CompanyValues {
  return {
    legalName: c.legalName,
    displayName: c.displayName,
    registrationNo: c.registrationNo ?? '',
    sectorCode: c.sectorCode ?? '',
    sizeBand: c.sizeBand ?? '',
    employeeCount: c.employeeCount === null ? '' : String(c.employeeCount),
    country: c.country ?? '',
    region: c.region ?? '',
    website: c.website ?? '',
    description: c.description ?? '',
    addressLine1: c.address?.line1 ?? '',
    addressLine2: c.address?.line2 ?? '',
    city: c.address?.city ?? '',
    postalCode: c.address?.postalCode ?? '',
    state: c.address?.state ?? '',
    fiscalYearStartMonth: String(c.fiscalYearStartMonth),
    currency: c.currency,
    parentCompanyId: c.parentCompanyId ?? '',
  };
}

/** Server `errors[].path` → form field (address parts are nested in the API). */
export function companyFieldOf(path: string): keyof CompanyValues | null {
  const nested: Record<string, keyof CompanyValues> = {
    'address.line1': 'addressLine1',
    'address.line2': 'addressLine2',
    'address.city': 'city',
    'address.postalCode': 'postalCode',
    'address.state': 'state',
  };
  const key = path.replace(/^company\./, '');
  if (nested[key]) return nested[key];
  return key in EMPTY_COMPANY ? (key as keyof CompanyValues) : null;
}
