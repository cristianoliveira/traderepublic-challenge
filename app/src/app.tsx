import { useEffect, useRef, useState } from 'preact/hooks'
import trLogo from './assets/logo.svg'
import './app.css'
import { useWatchList, ERRORS } from './hooks/useWatchList'
import { useStockLiveStream, type StockData } from './hooks/useStockLiveStream';

const WatchListItem = ({ isin }: { isin: string }) => {
  const { subscribeTo } = useStockLiveStream();
  const [lastStockState, setLastStockState] = useState<StockData | null>(null);
  useEffect(() => subscribeTo(isin, setLastStockState), [subscribeTo]);

  return (
    <tr class="mover">
      <td class="name">{isin}</td>
      <td class="price">{lastStockState?.price}</td>
      <td class="percentage">{"2.43%"}</td>
    </tr>
  );
}

export function App() {
  const formRef = useRef<HTMLFormElement>(null)
  const watchList = useWatchList();
  const [error, setError] = useState<string>();

  const onSubmit = (e: Event) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement);
    const error = watchList.add(formData.get('isin') as string)
    setError(ERRORS[error])

    formRef.current!.reset();
  }
  return (
    <>
      <div>
        <a href="https://traderepublic.com" target="_blank">
          <img src={trLogo} class="logo" alt="Preact logo" />
        </a>
      </div>
      <h1>Tradewishes</h1>
      <p>Keep track of your prefered ISIN performance</p>

      <main>
        <form ref={formRef} id="isin-form" onSubmit={onSubmit}>
          <input type="text" name="isin" placeholder="Enter ISIN" />
          <button type="submit">Add to Watchlist</button>
          {error && <span data-testid="isin-error" class="form-error">{error}</span>}
        </form>
      </main>

      <section>
        <div class="top-movers">
          <header>
            <h2>Your watch list</h2>
          </header>
          <table>
            <thead>
              <tr>
                <th class="name">Name</th>
                <th class="price">Price</th>
                <th class="percentage">Diff%</th>
              </tr>
            </thead>
            <tbody data-testid="watch-list">
              {watchList.items.map((isin) => (
                <WatchListItem isin={isin} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer>
        <p>Contact | Privacy Policy</p>
      </footer>
    </>
  )
}
