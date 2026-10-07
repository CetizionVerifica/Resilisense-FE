import { ImageIcon, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type FilesControllerGet200 } from '@/api/generated/model';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileDropzone, UploadProgress } from '@/components/ui/file-dropzone';
import { uploadFailureMessage } from '../failure-message';
import { UPLOAD_RULES } from '../upload';
import { useFileUpload } from '../use-file-upload';
import { FileImage } from './file-image';

export interface LogoFieldProps {
  /** Whose logo it is (alt text), e.g. the workspace or company name. */
  ownerName: string;
  fileId: string | null;
  /** Saves the new logo id (or null to remove it) on the workspace or company. */
  onSave: (fileId: string | null) => void;
  saving?: boolean;
  editable: boolean;
}

/**
 * Current logo + upload/replace/remove (M14 US-14-2). Uploading runs the whole M14 flow; once the
 * file is ready, `onSave` stores it on the owner. The API retires the replaced logo file.
 */
export function LogoField({ ownerName, fileId, onSave, saving, editable }: LogoFieldProps) {
  const { t } = useTranslation('files');
  const rules = UPLOAD_RULES.logo;
  const upload = useFileUpload('logo', (file: FilesControllerGet200) => onSave(file.id));
  const s = upload.state;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        {fileId ? (
          <FileImage fileId={fileId} alt={t('logo.alt', { name: ownerName })} />
        ) : (
          <span className="grid size-16 place-items-center rounded-sm border border-dashed border-border-strong text-fg-muted">
            <ImageIcon className="size-5" aria-hidden />
          </span>
        )}
        <div className="grid gap-1">
          <p className="text-body text-fg">{fileId ? ownerName : t('logo.none')}</p>
          {fileId && editable ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-self-start"
              loading={saving}
              disabled={upload.busy}
              onClick={() => onSave(null)}
            >
              <Trash2 aria-hidden />
              {t('logo.remove')}
            </Button>
          ) : null}
        </div>
      </div>
      {editable ? (
        <FileDropzone
          label={t('logo.drop')}
          browseLabel={fileId ? t('logo.replace') : t('logo.browse')}
          hint={t('hint', { types: rules.types.join(', '), size: rules.maxBytes / 1024 / 1024 })}
          accept={rules.accept}
          disabled={upload.busy || saving}
          onFiles={([file]) => file && void upload.start(file)}
        >
          {s.phase === 'uploading' ? (
            <UploadProgress label={t('progress.uploading', { name: s.name })} value={s.progress} />
          ) : null}
          {s.phase === 'checking' ? (
            <p className="text-small text-fg-secondary">{t('progress.checking', { name: s.name })}</p>
          ) : null}
          {s.phase === 'failed' ? (
            <Alert tone="danger" className="text-start">
              <span>{uploadFailureMessage(t, s.failure)}</span>
              {s.failure.kind === 'transfer' || s.failure.kind === 'timeout' ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="justify-self-start px-0"
                  onClick={upload.retry}
                >
                  {t('error.retry')}
                </Button>
              ) : null}
            </Alert>
          ) : null}
        </FileDropzone>
      ) : (
        <p className="text-small text-fg-muted">{t('logo.readOnly')}</p>
      )}
    </div>
  );
}
