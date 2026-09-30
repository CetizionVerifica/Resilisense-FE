import { render, screen } from '@testing-library/react';
import { FormField } from './form-field';
import { Input } from './input';

describe('FormField', () => {
  it('labels the control and links hint + error via aria-describedby', () => {
    render(
      <FormField label="Email" hint="Work address" error="Required">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Work address Required');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('is valid without an error', () => {
    render(
      <FormField label="Name">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid');
  });
});
