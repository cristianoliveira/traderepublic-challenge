import trLogo from './assets/logo.svg'
import './app.css'

export function App() {
  const onSubmit = (e: Event) => {
    e.preventDefault()
    console.log('@@@@@@ e: ', e);
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
        <form id="isin-form" onSubmit={onSubmit}>
          <input type="text" id="isin-input" placeholder="Enter ISIN" />
          <button type="submit">Add to Watchlist</button>
        </form>
        <div class="watchlist" id="watchlist"></div>
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
              <tr class="mover">
                <td class="name">US0378331005</td>
                <td class="price">€1,083.60</td>
                <td class="percentage">3.08%</td>
              </tr>
              <tr class="mover">
                <td class="name">US38259P5089</td>
                <td class="price">$259.99</td>
                <td class="percentage">2.43%</td>
              </tr>
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
