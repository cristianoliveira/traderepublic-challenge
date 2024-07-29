import { useRef, useState } from "preact/hooks";
import { useStockLiveStream } from "../hooks/useStockLiveStream";
import { ERRORS, useWatchList } from "../hooks/useWatchList";
import { WatchListItem } from "./WatchListItem";

import styles from './WatchList.module.css';

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
    <div className={styles.watchlist}>
      <section className={styles.watchListFormSection}>
        <form className={styles.watchListForm} ref={formRef} id="isin-form" onSubmit={onSubmit}>
          <input type="text" name="isin" placeholder="Enter ISIN" aria-label="Enter ISIN" />
          <button type="submit" aria-label="Add to Watchlist">Add to Watchlist</button>
          {error && <span data-testid="isin-error" className={styles.watchListFormError}>{error}</span>}
        </form>
      </section>

      <section>
        <div>
          <div data-testid="connection-status">
            {connectionState === 'disconnected' && <span class="connection-lost">❌ Connection lost</span>}
            {connectionState === 'connecting' && <span class="connection-connecting">⏳Connecting...</span>}
            {connectionState === 'connected' && <span class="connection-live">✅ Live</span>}
          </div>

          <h2>Your watch list</h2>

          <table className={styles.watchListTable}>
            <thead>
              <tr className={styles.watchListHeaderRow}>
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
    </div>
  )
};
