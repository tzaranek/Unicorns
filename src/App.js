import './App.css';
import React from 'react';
import deck from './assets/rules/deck.json'

class Game extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
      names: Array(0).fill(null),
			stables: Array(0).fill(null), // TODO: add to the array as players join
			hands: Array(0).fill(null),
			deck: Array(0).fill(null),
			discard: Array(0).fill(null),
      focusedStable: null,
		};

    var tmpArray = this.state.names;
    tmpArray.push("Player 0");
    tmpArray.push("Player 1");
    tmpArray.push("Player 2");
    tmpArray.push("Player 3");

    // Hardcoded hands to test switching focus
    // TODO: Make these from the deck
    tmpArray = this.state.hands;
    tmpArray.push([5, 10, 15, 20, 25]);
    tmpArray.push([30, 35, 40, 45, 50]);
    tmpArray.push([1, 2, 3, 4, 5]);
    tmpArray.push([61, 62]);
    this.setState({hands: tmpArray})

    var tmpArray2 = this.state.stables;
    for (var i = 0; i < this.state.names.length; ++i)
    {
      var tmpStable = new Stable()
      tmpStable.state.unicorns = tmpArray[i];
      tmpStable.state.upgrades = tmpArray[i];
      tmpStable.state.downgrades = tmpArray[i];
      tmpArray2.push(tmpStable);
    }
    this.setState({stables: tmpArray2});
  }

  renderPreview(name, cardsInHand, unisInStable, upInStable, downInStable)
  {
    var cName = "StablePreview".concat(this.state.focusedStable === name ? " SelectedStable" : "");

    return(
      <div id={name} className={cName} onClick={() => this.setState({focusedStable: name})}>
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
    var unisInStables = [4, 2, 5, 1];
    var upInStables = [2, 0, 0, 1];
    var downInStables = [0, 0, 3, 1];

    var rows = [];
    // 0 is us!
    for (var i = 0; i < this.state.names.length; ++i)
    {
      // By default, focus the first opponent for now.
      rows.push(this.renderPreview(this.state.names[i], this.state.hands[i].length, unisInStables[i], upInStables[i], downInStables[i]));
    }

    return (
      <div className="PreviewSidebar">
        {rows}
        <br/>
        <Card id="Deck" cardId={-1} on></Card>
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
          <Hand cardsInHand={this.state.hands[3]}></Hand>

          {/* Focused opponent's stable */}
					<Stable uni={this.state.stables[3].state.unicorns}
                  upg={this.state.stables[3].state.upgrades}
                  dg={this.state.stables[3].state.downgrades}></Stable>
          
					<br/>

          {/* Own Stable */}
					<Stable uni={this.state.stables[0].state.unicorns}
                  upg={this.state.stables[0].state.upgrades}
                  dg={this.state.stables[0].state.downgrades}></Stable>

          {/* Own Hand */}
					<Hand cardsInHand={this.state.hands[0]}></Hand>
				</header>
				
			</div>
		);
	}
}

class Stable extends React.Component
{
	constructor(props) {
    super(props);
    if (this.props)
    {
      this.state = {
        unicorns: this.props.uni,
        upgrades: this.props.upg,
        downgrades: this.props.dg,
      }
    }
    else
    {
      this.state = {
        unicorns: null,
        upgrades: null,
        downgrades: null,
      }
    }
  }

  cardsHtml(cards)
  {
    var tmp = [];
    if (cards.length > 0)
		{
			cards.forEach(element => {
				tmp.push(<Card cardId={element}></Card>)
			});
		}

    return tmp;
  }

	render()
	{
    var grades = this.cardsHtml(this.state.upgrades);
    grades.concat(this.cardsHtml(this.state.downgrades));
    var corns = this.cardsHtml(this.state.unicorns);


		return (
			<p className="Stable">
				{/* Up/Downgrades */}
				{grades}
				<br />
				{/* Unicorns */}
				{corns}
			</p>
		)
	}
}

class Hand extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
			cards: this.props.cardsInHand,
		};
  }

	render()
	{
		var cards = [];
		if (this.state.cards.length > 0)
		{
			this.state.cards.forEach(element => {
				cards.push(<Card cardId={element}></Card>)
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
			cardId: this.props,
		};
  }

	render()
	{
		return (
			<img src={deck[this.state.cardId.cardId].path} className="CardThumb" alt="card" />
		);
	}
}

export default Game;
