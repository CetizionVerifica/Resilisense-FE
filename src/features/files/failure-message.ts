import { type TFunction } from 'i18next';
import { type UploadFailure } from './upload';

const MB = 1024 * 1024;

/** User-facing message for a failed upload (M14 US-14-3). */
export function uploadFailureMessage(t: TFunction<'files'>, failure: UploadFailure): string {
  switch (failure.kind) {
    case 'tooLarge':
      return t('error.tooLarge', { size: failure.maxBytes / MB });
    case 'rejected':
      return t(`error.rejected.${failure.field}`);
    case 'infected':
      return t('error.infected');
    case 'transfer':
      return t('error.transfer');
    case 'timeout':
      return t('error.timeout');
    case 'api':
      if (failure.error.code === 'limit_exceeded') return t('error.storageFull');
      if (failure.error.code === 'forbidden' || failure.error.code === 'entitlement_required')
        return t('error.forbidden');
      if (failure.error.code === 'workspace_suspended') return t('common:suspended.readOnly');
      return t('error.generic');
  }
}
