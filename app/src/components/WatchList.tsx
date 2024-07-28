import { useEffect, useRef, useState } from "preact/hooks";
import { StockData, useStockLiveStream } from "../hooks/useStockLiveStream";
import { ERRORS, useWatchList } from "../hooks/useWatchList";

const changePercentage = (stock: StockData) => {
  const change = Number((stock.price - stock.bid).toFixed(2));
  return Number(((change / stock.bid) * 100).toFixed(2));
}

export type WatchListItemProps = {
  isin: string;
  onUnwatch: () => void;
  subscribeTo: (isin: string, callback: (stock: StockData) => void) => void;
}

export const WatchListItem = ({ isin, onUnwatch, subscribeTo }: WatchListItemProps) => {
  const [stock, setStock] = useState<StockData | null>(null);

  useEffect(() => subscribeTo(isin, setStock), []);

  return (
    <tr data-testid={`${isin}-item`} class="mover">
      <td class="name">{isin}</td>
      {!stock
        ?
        <>
          <td class="price">$x.xx (loading...)</td>
          <td class="percentage">x.xx% (loading...)</td>
        </>
        : <>
          <td class="price">{`$${stock.price.toFixed(2)}`}</td>
          <td class="percentage">{`${changePercentage(stock)}%`}</td>
        </>
      }
      <td class="actions">
        <button
          title="Unwatch this item"
          class="unwatch"
          data-testid={`${isin}-unwatch-btn`}
          onClick={onUnwatch}>x</button>
      </td>
    </tr>
  );
}

export const WatchList = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const watchList = useWatchList();
  const [error, setError] = useState<string>();
  const { connectionState, subscribeTo } = useStockLiveStream();

  const onSubmit = (e: Event) => {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    const error = watchList.add(formData.get('isin') as string)
    setError(ERRORS[error])

    formRef.current!.reset();
  }

  return (
    <>
      <main>
        <form ref={formRef} id="isin-form" onSubmit={onSubmit}>
          <input type="text" name="isin" placeholder="Enter ISIN" />
          <button type="submit">Add to Watchlist</button>
          {error && <span data-testid="isin-error" class="form-error">{error}</span>}
        </form>
      </main>

      <section>
        <div class="watchlist-table">
          <div data-testid="connection-status" class="connection-status">
            {connectionState === 'disconnected' && <span class="connection-lost">❌ Connection lost</span>}
            {connectionState === 'connecting' && <span class="connection-connecting">⏳Connecting...</span>}
            {connectionState === 'connected' && <span class="connection-live">✅ Live</span>}
          </div>
          <header>
            <h2>Your watch list</h2>
          </header>
          <table>
            <thead>
              <tr class="table-header">
                <th class="name">Name</th>
                <th class="price">Price</th>
                <th class="percentage">Diff%</th>
                <th class="actions">▼</th>
              </tr>
            </thead>
            <tbody data-testid="watch-list">
              {watchList.items.map((isin: string) => (
                <WatchListItem
                  key={isin}
                  isin={isin}
                  subscribeTo={subscribeTo}
                  onUnwatch={() => watchList.remove(isin)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
};
