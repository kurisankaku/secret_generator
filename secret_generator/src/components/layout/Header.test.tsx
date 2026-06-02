import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../../i18n/I18nProvider';
import { Header } from './Header';

describe('Header language switcher', () => {
  it('switches visible navigation labels between English and Japanese', async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <Header currentPath="/generator" onNavigate={vi.fn()} />
      </I18nProvider>,
    );

    await user.selectOptions(screen.getByRole('combobox'), 'ja');
    expect(screen.getByRole('button', { name: '生成' })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox'), 'en');
    expect(screen.getByRole('button', { name: 'Generator' })).toBeInTheDocument();
  });
});
