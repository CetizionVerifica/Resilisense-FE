import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileDropzone, UploadProgress } from './file-dropzone';

const file = (name: string) => new File(['x'], name, { type: 'image/png' });

describe('FileDropzone', () => {
  it('is a labelled group whose browse button opens the file picker from the keyboard', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    render(
      <FileDropzone label="Drop a logo here" browseLabel="Choose a file" hint="PNG · up to 2 MB" onFiles={onFiles} />,
    );
    const group = screen.getByRole('group', { name: 'Drop a logo here' });
    expect(group).toHaveAccessibleDescription('PNG · up to 2 MB');
    const input = screen.getByTestId('file-input');
    const click = vi.spyOn(input, 'click');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Choose a file' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalled();
    await user.upload(input, file('a.png'));
    expect(onFiles).toHaveBeenCalledWith([expect.objectContaining({ name: 'a.png' })]);
  });

  it('takes a dropped file, only the first unless multiple', () => {
    const onFiles = vi.fn();
    render(<FileDropzone label="Drop" browseLabel="Browse" onFiles={onFiles} />);
    fireEvent.drop(screen.getByRole('group', { name: 'Drop' }), {
      dataTransfer: { files: [file('a.png'), file('b.png')] },
    });
    expect(onFiles).toHaveBeenCalledWith([expect.objectContaining({ name: 'a.png' })]);
  });

  it('ignores drops while disabled', () => {
    const onFiles = vi.fn();
    render(<FileDropzone label="Drop" browseLabel="Browse" disabled onFiles={onFiles} />);
    fireEvent.drop(screen.getByRole('group', { name: 'Drop' }), { dataTransfer: { files: [file('a.png')] } });
    expect(onFiles).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Browse' })).toBeDisabled();
  });

  it('announces upload progress with a named progress bar', () => {
    render(
      <FileDropzone label="Drop" browseLabel="Browse" onFiles={() => undefined}>
        <UploadProgress label="Uploading logo.png" value={0.42} />
      </FileDropzone>,
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading logo.png' })).toHaveAttribute('aria-valuenow', '42');
  });
});
