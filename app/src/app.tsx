import trLogo from './assets/logo.svg'
import './app.css'
import { WatchList } from './components/WatchList';

export function App() {
  return (
    <>
      <header>
        <a href="https://traderepublic.com" target="_blank">
          <img src={trLogo} class="logo" alt="Preact logo" />
        </a>
        <h1>Tradewishes</h1>
        <p>Keep track of your prefered ISIN performance</p>
      </header>


      <main>
        <WatchList />
      </main>

      <footer>
        <p>Contact | Privacy Policy</p>
      </footer>
    </>
  )
}
