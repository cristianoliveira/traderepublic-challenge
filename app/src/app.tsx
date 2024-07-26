import { useRef, useState } from 'preact/hooks'
import trLogo from './assets/logo.svg'
import './app.css'

type WatchItem = {
  name: string;
  price: string;
  percentage: string;
};

type WatchListHook = {
  /**
   * List of ISINs
   */
  items: string[];
  /**
   * Add an ISIN to the watch list
   * @param isin ISIN code
   * @returns true if the ISIN was added, false if it already exists
   */
  add: (isin: string) => boolean;
  /**
   * Remove an ISIN from the watch list
   * @param isin ISIN code
   * @returns true if the ISIN was removed, false if it does not exist
   */
  remove: (isin: string) => boolean;
}


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

const useWatchList = (): WatchListHook => {
  const [items, setItem] = useState<string[]>([]);

  return {
    items,

    add: (isin: string) => {
      if (items.includes(isin)) {
        return false;
      }

      setItem((prev) => [...prev, isin])

      return true;
    },

    remove: (isin: string) => {
      const itemToRemove = items.find((item) => item === isin)

      setItem((prev) => prev.filter((item) => item !== isin))

      return !!itemToRemove
    },
  };
}

export function App() {
  const formRef = useRef<HTMLFormElement>(null)
  const watchList = useWatchList();
  const [error, setError] = useState<string>();

  const onSubmit = (e: Event) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement);

    const value = formData.get('isin') as string;
    const hasAddedIsin = watchList.add(value)
    setError(!hasAddedIsin ? 'ISIN was not added because it already exists' : undefined)

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
