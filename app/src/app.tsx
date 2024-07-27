import { useRef, useState } from 'preact/hooks'
import trLogo from './assets/logo.svg'
import './app.css'
import { useWatchList, ERRORS } from './hooks/useWatchList'

type WatchItem = {
  name: string;
  price: string;
  percentage: string;
};

const isinMap: Record<string, WatchItem> = {
  'US0378331005': {
    name: 'US0378331005',
    price: '€1,083.60',
    percentage: '3.08%',
  },
  'US38259P5089': {
    name: 'US38259P5089',
    price: '$259.99',
    percentage: '2.43%',
  },
};

const WatchListItem = ({ isin }: { isin: string }) => {
  const item = isinMap[isin];
  return (
    <tr class="mover">
      <td class="name">{item.name}</td>
      <td class="price">{item.price}</td>
      <td class="percentage">{item.percentage}</td>
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
                <WatchListItem key={isin} isin={isin} />
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
