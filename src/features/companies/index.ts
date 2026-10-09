// Public surface of the companies feature (M02 §9). Other features import only from here
// (docs/revamp/06-modular-build.md §3).
export { CompanyFields } from './components/company-fields';
export { applyCompanyErrors } from './form-errors';
export { companySchema, EMPTY_COMPANY, toCreateBody, type CompanyValues } from './schemas';
