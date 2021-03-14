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
    this.allowDrop = this.allowDrop.bind(this)
    this.onDragStart = this.dragStart.bind(this)
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

  allowDrop(event)
  {
    console.log("allowDrop")
    var draggedCardInfo = event.dataTransfer.getData("text/html");
    draggedCardInfo = draggedCardInfo.split("_")
    var draggedCardId = draggedCardInfo[0]
    var draggedCardHand = draggedCardInfo[1]

    var a = event.currentTarget.id.split("_");
    var tmpPlayers = this.state.Players.slice()
    tmpPlayers[a[0]].stable[a[1]].push(deckJSON[draggedCardId])
    
    var hand = tmpPlayers[draggedCardHand].hand;
    for (var i = 0; i < hand.length; ++i)
    {
      if (hand[i].id === draggedCardId)
      {
        hand.splice(i, 1)
      }
    }

    this.setState({Players : tmpPlayers})
  }

  dragStart(event)
  {
    console.log("Drag Start")
    var playerAndCard = event.target.id + "_" + event.target.pId
    event.dataTransfer.setData('Text/html', playerAndCard);
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
        <Card id="Deck" clickFunc={this.dealCard} 
        cardInfo={deckJSON["-1"]}
        cardId={-1}></Card>
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
            <Hand cardsInHand={focusedPlayer.hand}
                  player={focusID}
                  dragStartEvent={this.dragStart}
                  dragEndEvent={this.dragEnd}></Hand>

            {/* Focused opponent's stable */}
            {<Stable player={focusID}
                    dropEvent={this.allowDrop}
                    uni={focusedPlayer.stable["unicorns"]}
                    ug={focusedPlayer.stable["upgrades"]}
                    dg={focusedPlayer.stable["downgrades"]}></Stable>}
            
            <br/>

            {/* Own Stable */}
            {<Stable player={myID} 
                    dropEvent={this.allowDrop}
                    uni={myPlayer.stable["unicorns"]}
                    ug={myPlayer.stable["upgrades"]}
                    dg={myPlayer.stable["downgrades"]}></Stable>}

            {/* Own Hand */}
            <Hand cardsInHand={myPlayer.hand}
                    player={myID}                     
                    dragStartEvent={this.dragStart}
                    dragEndEvent={this.dragEnd}></Hand>
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

function stableCardsHtml(cards, dragStart, dragEnd)
{
  var tmp = [];
  if (cards.length > 0)
  {
    cards.forEach(element => {
      tmp.push(<Card draggable="false" id="RealCard" cardInfo={element} onDragStart={dragStart} onDragEnd={dragEnd} alt="handCard"></Card>)
    });
  }

  return tmp;
}

function Stable(props)
{
  var grades = stableCardsHtml(props.ug, props.dragStartEvent, props.dragEndEvent);
  grades.concat(stableCardsHtml(props.dg));
  var corns = stableCardsHtml(props.uni);

  var gradeId = props.player + "_unicorns"; //TODO: Change this!
  var cornId = props.player + "_unicorns"; 

  var stableDrop = (e) => {
    console.log("stableDrop");
    props.dropEvent(e)
  }

  grades.push(<CardPlaceholder id={gradeId} ondropProp={stableDrop}></CardPlaceholder>)
  corns.push(<CardPlaceholder id={cornId} ondropProp={stableDrop}></CardPlaceholder>)


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

function handCardsHtml(cards, playerId, dragStart, dragEnd)
{
  var tmp = [];
  if (cards.length > 0)
  {
    cards.forEach(element => {
      tmp.push(<Card pId={playerId} cardInfo={element} onDragStart={dragStart} onDragEnd={dragEnd} alt="handCard"></Card>)
    });
  }

  return tmp; 
}

function Hand(props)
{
  return(
    <p className="Hand">
      {handCardsHtml(props.cardsInHand, props.player, props.dragStartEvent, props.dragEndEvent)}
    </p>
  );
}

function Card(props)
{
  var cardId = props.cardInfo["id"]
  var path = props.cardInfo["path"]

  return (
    <img id={cardId + "_" + props.pId} src={path} className={"CardThumb"} onClick={props.clickFunc} onDragEnd={props.onDragEnd} onDragStart={props.onDragStart} draggable="true" alt="card" />
  );
}

function CardPlaceholder(props)
{
  var onDragOver = (e) => {
    console.log("DO")
    let event = e;
    event.stopPropagation();
    event.preventDefault();
  }
  
  var onFileDrop = (e) => {
    console.log("FD")
    let event = e;
    event.stopPropagation();
  
    console.log("onFileDrop");
    props.ondropProp(e)
  }


  return (
    <img id={props.id} src={deckJSON[-2].path} className={"CardThumb"} 
    onDragOver={onDragOver}
    onDrop={onFileDrop} alt="card2" />
  );
}

export default Game;
