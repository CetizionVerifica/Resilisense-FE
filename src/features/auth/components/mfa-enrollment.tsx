import { useTranslation } from 'react-i18next';
import { AuthHeading } from './auth-card';
import { MfaSetup } from './mfa-setup';

/**
 * Mandatory MFA enrolment for platform users (M01 §7.1): the enrolment token authorises only
 * setup/confirm; confirm returns recovery codes and the session.
 */
export function MfaEnrollment({
  enrollmentToken,
  onDone,
}: {
  enrollmentToken: string;
  onDone: (token: string) => void;
}) {
  const { t } = useTranslation('auth');
  return (
    <MfaSetup
      headers={{ authorization: `Bearer ${enrollmentToken}` }}
      heading={(stage) =>
        stage === 'codes' ? (
          <AuthHeading title={t('enroll.codesTitle')} description={t('enroll.codesDescription')} />
        ) : (
          <AuthHeading title={t('enroll.title')} description={t('enroll.description')} />
        )
      }
      finishLabel={t('enroll.continue')}
      onFinish={(session) => session && onDone(session.accessToken)}
    />
  );
}
