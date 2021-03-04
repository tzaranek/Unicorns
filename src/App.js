import './App.css';
import React from 'react';
import deck from './assets/rules/deck.json'

//var imageArray = []
//imageArray.push(baby);
const iconPath = process.env.PUBLIC_URL;

class Game extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			stables: Array(4).fill(new Stable()), // TODO: add to the array as players join
			hands: Array(4).fill(null),
			deck: Array(0).fill(null),
			discard: Array(0).fill(null),
		};
  }

  renderPreview(name, cardsInHand, unisInStable, upInStable, downInStable, selected)
  {
    var cName = "StablePreview";
    cName = cName.concat(selected === true ? " SelectedStable" : "");

    return(
      <div className={cName}>
        <b>{name}</b> <br />
        Hand: {cardsInHand} <br />
        Unicorns: {unisInStable} <br />
        Upgrades: {upInStable} <br />
        Downgrades: {downInStable} <br />
      </div>
    )
  }

  renderPreviews()
  {
    // TODO: Replace with the arrays containg the players' actual hands/stables
    var names = ["Player 1", "Player 2", "Player 3"];
    var cardsInHands = [3, 6, 5];
    var unisInStables = [4, 2, 5];
    var upInStables = [2, 0, 0];
    var downInStables = [0, 0, 3];

    var rows = [];
    for (var i = 0; i < 3; ++i)
    {
      // By default, focus the first opponent for now.
      rows.push(this.renderPreview(names[i], cardsInHands[i], unisInStables[i], upInStables[i], downInStables[i], i === 0 ? true : false));
    }

    return (
      <div className="PreviewSidebar">
        {rows}
      </div>
    )
  }

	render()
	{
		return (
      <div className="App">
        
        {/* Bar on the left showing the other players' hand/stable info */}
        {this.renderPreviews()}

        {/* Main column in the center */}
				<header className="App-header">
          
          {/* Focused opponent's hand */}
          <Hand></Hand>

          {/* Focused opponent's stable */}
					<Stable></Stable>
          
					<br/>

          {/* Own Stable */}
					<Stable></Stable>

          {/* Own Hand */}
					<Hand></Hand>
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
      downgrades: Array(10).fill(null),
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
				<img src={deck[69].path} className="CardThumb" alt="card" />
				<br />
				{/* Unicorns */}
				<img src={deck[13].path} className="CardThumb" alt="card" />
				<img src={deck[13].path} className="CardThumb" alt="card" />
				<img src={deck[13].path} className="CardThumb" alt="card" />
				<img src={deck[13].path} className="CardThumb" alt="card" />
			</p>
		)
	}
}

class Hand extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			cards: Array(0).fill(null), // TODO: Probably want to initialize this to null and then call draw 5 times to start
		};
  }

	draw()
	{
		this.state.cards.push(new Card(0));
	}

	render()
	{
		var cards = [];
		this.draw();
		if (this.state.cards.length > 0)
		{
			this.state.cards.forEach(element => {
				cards.push(<Card cardId={element.state.cardId}></Card>)
			});
		}

		return(
			<p className="Hand">
				{cards}
			</p>
		)
	}
}

class Card extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			cardId: this.props, // TODO: Construct the cards into the deck, which assigns the cardId and image path
			cardPath: deck[0].path,
		};
  }

	render()
	{
		var imgPath = this.state.cardPath;
		var pub = {process}
		var a = iconPath;
		imgPath = imgPath.concat(pub);
		return (
			<img src={deck[1].path} className="CardThumb" alt="card" /> // TODO: Set src from the json
		);
	}
}

export default Game;
