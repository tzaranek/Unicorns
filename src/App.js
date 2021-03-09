import './App.css';
import React from 'react';
import deckJSON from './assets/rules/deck.json'

class Game extends React.Component
{
	constructor(props) {
    super(props);
    this.state = {
      Players : [],
      deck : [],
      discard : [],
      focusedStableId: 1,
      turnId: 0,
		};

    this.startGame = this.startGame.bind(this)
    this.addPlayer = this.addPlayer.bind(this)
    this.endTurn = this.endTurn.bind(this)
    this.dealCard = this.dealCard.bind(this)
  }

  // https://stackoverflow.com/a/2450976
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  endTurn()
  {
    var tmp = this.state.turnId + 1;
    if (tmp === this.state.Players.length)
    {
      tmp = 0;
    }

    this.setState({turnId : tmp, focusedStableId : tmp})
  }

  dealCard()
  {
    var c = this.state.deck.pop();
    var tmpPlayers = this.state.Players.slice()

    tmpPlayers[this.state.turnId].hand.push(c);
    this.setState({Players : tmpPlayers});
  }

  startGame()
  {
    if (this.state.Players.length < 2)
    {
      alert("Cannot start game with less than 2 players!")
      return null;
    }

    const tmpDeck = this.state.deck.slice();

    for (var key in deckJSON)
    {
      var c = deckJSON[key]
      for (var i = 0; i < c.count; ++i)
      {
        tmpDeck.push(c);
      }
    }

    this.shuffle(tmpDeck)
    
    // Now we have a shuffled deck. Pop 5 cards for each player
    const tmpPlayers = this.state.Players.slice();
    for (i = 0; i < tmpPlayers.length; ++i)
    {
      for (var j = 0; j < 5; ++j)
      {
        var nextCard = tmpDeck.pop();
        tmpPlayers[i].hand.push(nextCard);
      }

      // Add a baby to each person's stable
      tmpPlayers[i].stable["unicorns"].push(deckJSON[i])
    }

    this.setState({Players : tmpPlayers, deck : tmpDeck, started : true});

    /*
    Game:
      Deck: Cards
      Discard: Cards
      FocusedStableId: int
      turnId: int
      Player:
        Name: string
        Focused: bool
        Hand: Cards
        Stable: Cards, Cards, Cards
    */

  }

  addPlayer(name)
  {
    // TODO: Remove hardcoded players
    var tmpPlayers = []
    var tmpPlayer = {};
    tmpPlayer["name"] = "Player " + this.state.Players.length
    tmpPlayer["hand"] = [];
    tmpPlayer["stable"] = {}
    tmpPlayer["stable"]["unicorns"] = []
    tmpPlayer["stable"]["upgrades"] = []
    tmpPlayer["stable"]["downgrades"] = []
    tmpPlayers = this.state.Players.concat(tmpPlayer)

    this.setState({Players: tmpPlayers})
  }

  renderPreview(name, cardsInHand, unisInStable, upInStable, downInStable)
  {
    var focusedId = this.getIdFromName(name);
    var cName = "StablePreview".concat(this.state.focusedStableId === focusedId ? " SelectedStable" : "");

    return(
      <div id={name} className={cName} onClick={() => this.setState({focusedStableId: this.getIdFromName(name)})}>
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
    var rows = [];
    // 0 is us!
    this.state.Players.forEach(element => {
      rows.push(this.renderPreview(element.name, element.hand.length, element.stable["unicorns"].length, element.stable["upgrades"].length, element.stable["downgrades"].length));
    });

    return (
      <div className="PreviewSidebar">
        {rows}
        <br/>
        <Card id="Deck" clickFunc={this.dealCard} cardId={-1}></Card>
        <br/>
        <button onClick={this.endTurn}>End Turn</button>
      </div>
    )
  }

  getIdFromName(name)
  {
    for (var i = 0; i < this.state.Players.length; ++i)
    {
      if (this.state.Players[i].name === name)
        return i;
    }

    console.log("Did not find " + name + " in the list of Players!")
  }

	render()
	{
    if (this.state.started)
    {
      const myID = 0;
      const myPlayer = this.state.Players[myID];

      const focusID = this.state.focusedStableId;
      const focusedPlayer = this.state.Players[focusID];

      return (
        <div className="App">
          
          {/* Bar on the left showing the other players' hand/stable info */}
          {this.renderPreviews()}

          {/* Main column in the center */}
          <header className="App-header">
            
            {/* Focused opponent's hand */}
            <Hand cardsInHand={focusedPlayer.hand}></Hand>

            {/* Focused opponent's stable */}
            {<Stable uni={focusedPlayer.stable["unicorns"]}
                    ug={focusedPlayer.stable["upgrades"]}
                    dg={focusedPlayer.stable["downgrades"]}></Stable>}
            
            <br/>

            {/* Own Stable */}
            {<Stable uni={myPlayer.stable["unicorns"]}
                    ug={myPlayer.stable["upgrades"]}
                    dg={myPlayer.stable["downgrades"]}></Stable>}

            {/* Own Hand */}
            <Hand cardsInHand={myPlayer.hand}></Hand>
          </header>
          
        </div>
      );
    }
    else
    {
      return (
        <div>
          <button onClick={this.startGame}>Start Game</button>
          <button onClick={this.addPlayer}>Add Player</button>
        </div>
      )
    }
	}
}

function cardsHtml(cards)
{
  var tmp = [];
  if (cards.length > 0)
  {
    cards.forEach(element => {
      tmp.push(<Card id="RealCard" cardInfo={element}></Card>)
    });
  }

  return tmp;
}

function Stable(props)
{
  var grades = cardsHtml(props.ug);
  grades.concat(cardsHtml(props.dg));
  var corns = cardsHtml(props.uni);


  return (
    <p className="Stable">
      {/* Up/Downgrades */}
      {grades}
      <br />
      {/* Unicorns */}
      {corns}
    </p>
  );
}

function Hand(props)
{
  return(
    <p className="Hand">
      {cardsHtml(props.cardsInHand)}
    </p>
  );
}

function Card(props)
{
  // TODO: Remove debug vars
  var path = null;
  var cName = null;
  if (props.cardId === -1)
  {
    var id = props.cardId;
    var c = deckJSON[id];
    path = c.path;
    cName = "CardThumb"
  }
  else
  {
    path = props.cardInfo["path"]
    cName = "CardThumb zoom"
  }
  return (
    <img src={path} className={cName} onClick={props.clickFunc} alt="card" />
  );
}

export default Game;
