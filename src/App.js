//import logo from './logo.svg';
import cardBack from './assets/images/cardBack.png'
import basic from './assets/images/16_Basic Unicorn (Green)'
import nanny from './assets/images/78_Nanny Cam'
import yay from './assets/images/67_Yay'
import baby from './assets/images/0_Baby Unicorn (Red)'
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import deck from './assets/rules/deck.json'

class Game extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			stables: Array(4).fill(new Stable()),
			hands: Array(4).fill(null)
		};

		
  }

	render()
	{
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
	
					<Stable></Stable>
					<p>
					👷👷👷 Work in progress 👷👷👷
					</p>
					{/* {this.renderStable(0)} */}
					<Stable></Stable>
					<Hand cards={[new Card(0)]}></Hand>
					{/* {this.renderHand(0)} */}
				</header>
				
			</div>
		);
	}
}

class Stable extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			unicorns: Array(10).fill(null),
			upgrades: Array(10).fill(null),
		};

		const unis = this.state.unicorns.slice();
		unis[0] = new Card();
		this.setState({unicorns: unis});
  }

	render()
	{
		return (
			<p className="Stable">
				{/* Up/Downgrades */}
				<img src={yay} className="CardThumb" alt="card" />
				<br />
				{/* Unicorns */}
				{/* {new Card()} */}
				<img src={basic} className="CardThumb" alt="card" />
				<img src={basic} className="CardThumb" alt="card" />
				<img src={basic} className="CardThumb" alt="card" />
				<img src={basic} className="CardThumb" alt="card" />
			</p>
		)
	}
}

class Hand extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			cards: this.props.cards, //Set this to whatever is passed into the constructor!
		};
  }

	render()
	{
		var cards = [];
		this.state.cards.forEach(element => {
			cards.push(<Card cardId={element.state.cardId}></Card>)
		});
		return(
			<p className="Hand">
				{cards}
			</p>
			
			// <p className="Hand">
			// 	<img src={yay} className="CardThumb" alt="card" />
			// 	<img src={yay} className="CardThumb" alt="card" />
			// 	<img src={yay} className="CardThumb" alt="card" />
			// 	<img src={yay} className="CardThumb" alt="card" />
			// 	<img src={yay} className="CardThumb" alt="card" />
			// </p>
		)
	}
}

class Card extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			cardId: this.props, //Set this to whatever is passed into the constructor!
			cardPath: deck[0].path,
		};
  }

	render()
	{
		return (
			<img src={baby} className="CardThumb" alt="card" />
		);
	}
}

export default Game;
