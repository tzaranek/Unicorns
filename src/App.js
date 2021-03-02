//import logo from './logo.svg';
import cardBack from './cardBack.png'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="Stables">
          <div className="StablePreview SelectedStable">
            <b>Player 1</b> <br />
            Hand: 3 <br />
            Unicorns: 4 <br />
            Upgrades: 2 <br />
            Downgrades: 0 <br />
          </div>
          <div className="StablePreview">
          <b>Player 2</b> <br />
            Hand: 6 <br />
            Unicorns: 2 <br />
            Upgrades: 0 <br />
            Downgrades: 0 <br />
          </div>
          <div className="StablePreview">
          <b>Player 3</b> <br />
            Hand: 5 <br />
            Unicorns: 5 <br />
            Upgrades: 0 <br />
            Downgrades: 3 <br />
          </div>
        </div>

        <p className="Stable">
          {/* Unicorns */}
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <br />
          {/* Up/Downgrades */}
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
        </p>
        <p>
        👷👷👷 Work in progress 👷👷👷
        </p>
        <p className="Stable">
          {/* Unicorns */}
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <br />
          {/* Up/Downgrades */}
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
          <img src={cardBack} className="CardThumb" alt="card" />
        </p>
        <p className="Hand">
        <img src={cardBack} className="CardThumb" alt="card" />
        <img src={cardBack} className="CardThumb" alt="card" />
        <img src={cardBack} className="CardThumb" alt="card" />
        <img src={cardBack} className="CardThumb" alt="card" />
        <img src={cardBack} className="CardThumb" alt="card" />
        </p>
      </header>
      
    </div>
  );
}

export default App;
