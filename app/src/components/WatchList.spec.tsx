import { describe, it, expect, beforeEach, vi } from 'vitest';

import { WatchList } from './WatchList';
import { fireEvent, render, screen } from '@testing-library/preact';
import * as useStockLiveStreamHook from '../hooks/useStockLiveStream';

describe('WatchList', () => {
  beforeEach(() => {
    vi.spyOn(useStockLiveStreamHook, 'useStockLiveStream').mockReturnValue({
      connectionState: 'connected',
      subscribeTo: vi.fn(),
    });
  });

  it('allows adding itens to watchlist', () => {
    render(<WatchList />);

    const isinInput = screen.getByPlaceholderText('Enter ISIN');
    fireEvent.change(isinInput, { target: { value: 'US0378331005' } });

    fireEvent.submit(screen.getByText('Add to Watchlist'));

    expect(screen.getByTestId('watch-list').children).toHaveLength(1);

    fireEvent.change(isinInput, { target: { value: 'US5949181045' } });
    fireEvent.submit(screen.getByText('Add to Watchlist'));

    expect(screen.getByTestId('watch-list').children).toHaveLength(2);
  });

  it('does not allow adding duplicated items to watchlist', () => {
    render(<WatchList />);

    const isinInput = screen.getByPlaceholderText('Enter ISIN');
    fireEvent.change(isinInput, { target: { value: 'US0378331005' } });

    fireEvent.submit(screen.getByText('Add to Watchlist'));

    expect(screen.getByTestId('watch-list').children).toHaveLength(1);

    fireEvent.change(isinInput, { target: { value: 'US0378331005' } });
    fireEvent.submit(screen.getByText('Add to Watchlist'));

    expect(screen.getByTestId('watch-list').children).toHaveLength(1);
  });

  it('allows removing itens from watchlist', () => {
    render(<WatchList />);

    const isinInput = screen.getByPlaceholderText('Enter ISIN');
    fireEvent.change(isinInput, { target: { value: 'US0378331005' } });

    fireEvent.submit(screen.getByText('Add to Watchlist'));

    expect(screen.getByTestId('watch-list').children).toHaveLength(1);

    fireEvent.change(isinInput, { target: { value: 'US5949181045' } });
    fireEvent.submit(screen.getByText('Add to Watchlist'));

    expect(screen.getByTestId('watch-list').children).toHaveLength(2);

    fireEvent.click(screen.getByTestId('US0378331005-unwatch-btn'));

    expect(screen.getByTestId('watch-list').children).toHaveLength(1);
  });

  it('shows on the connection status of the live stream', () => {
    vi.spyOn(useStockLiveStreamHook, 'useStockLiveStream').mockReturnValue({
      connectionState: 'disconnected',
      subscribeTo: vi.fn(),
    });
    render(<WatchList />);

    expect(screen.getByText('❌ Connection lost')).toBeInTheDocument();
  });
});
