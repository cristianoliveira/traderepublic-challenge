import trLogo from './assets/logo.svg'
import './app.css'

export function App() {
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
        <form id="isin-form">
          <input type="text" id="isin-input" placeholder="Enter ISIN" />
          <button type="submit">Add to Watchlist</button>
        </form>
        <div class="watchlist" id="watchlist"></div>
      </main>

      <footer>
          <p>Contact | Privacy Policy</p>
      </footer>
    </>
  )
}
