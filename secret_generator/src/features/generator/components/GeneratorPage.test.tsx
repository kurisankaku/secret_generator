import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../../../i18n/I18nProvider';
import { GeneratorPage } from './GeneratorPage';

function renderGeneratorPage(initialPresetId = 'random-password', onPresetChange = vi.fn()) {
  return render(
    <I18nProvider>
      <GeneratorPage initialPresetId={initialPresetId} onPresetChange={onPresetChange} />
    </I18nProvider>,
  );
}

describe('GeneratorPage', () => {
  it('generates a JWT secret from the selected preset', async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();

    renderGeneratorPage('jwt-hs256', onPresetChange);
    await user.click(screen.getByTestId('generate-button'));

    const result = screen.getByTestId('secret-value').textContent ?? '';

    expect(screen.getByRole('heading', { name: 'JWT HS256 secret' })).toBeInTheDocument();
    expect(result).toHaveLength(43);
    expect(result).toMatch(/^[A-Za-z0-9_-]+$/u);
  });

  it('searches and selects presets without producing a generated value first', async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();

    renderGeneratorPage('random-password', onPresetChange);
    await user.type(screen.getByRole('searchbox'), 'csrf');
    await user.click(screen.getByRole('button', { name: /CSRF secret/u }));

    expect(onPresetChange).toHaveBeenCalledWith('csrf-secret');
    expect(screen.getByText(/Choose settings and generate/u)).toBeInTheDocument();
  });
});
