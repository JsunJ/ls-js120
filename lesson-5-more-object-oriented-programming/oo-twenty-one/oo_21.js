const readline = require('readline-sync');
const shuffle = require('shuffle-array');

class Card {
  static SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
  static SYMBOLS = ['♣', '♦', '♥', '♠'];

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.hidden = false;
  }

  toString() {
    if (this.isHidden()) return "Hidden";
    return `${this.getRank()} of ${this.getSuit()}`;
  }
}

class Deck {
  constructor() {
    this.cards = [];

    Card.SUITS.forEach(suit => {
      Card.RANKS.forEach(rank => {
        this.cards.push(new Card(suit, rank));
      });
    });

    this.shuffleCards();
  }

  shuffleCards() {
    shuffle(this.cards);
  }
}

class Player {
  static STARTING_PURSE = 5;
  static WINNING_PURSE = 10;

  constructor() {
    this.purse = Player.STARTING_PURSE;
    this.hand = [];
  }

  hit() {
    //STUB
  }

  stay() {
    //STUB
  }

  isBusted() {
    //STUB
  }

  score() {
    //STUB
  }
}

class Dealer {
  constructor() {
    this.hand = [];
  }

  hit() {
    //STUB
  }

  stay() {
    //STUB
  }

  isBusted() {
    //STUB
  }

  score() {
    //STUB
  }

  hide() {
    //STUB
  }

  reveal() {
    //STUB
  }

  deal() {
    //STUB
    // does the dealer or the deck deal?
  }
}

class TwentyOneGame {
  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Dealer();
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    if (['q', 'quit'].includes(this.promptToStart())) return;

    this.displayPurse();

    this.dealCards();
    this.showCards();
    this.playerTurn();
    this.dealerTurn();
    this.displayResult();

    this.displayGoodbyeMessage();
  }

  dealCards() {
    //STUB
  }

  showCards() {
    //STUB
  }

  playerTurn() {
    //STUB
  }

  dealerTurn() {
    //STUB
  }

  displayWelcomeMessage() {
    console.log('Welcome to Twenty-One!');
    this.displayCardArt();
    console.log('You will be given a starting purse of $5.');
    console.log('Each hand is worth $1. Get rich ($10) to win or go broke ($0) to lose!');
  }

  displayCardArt() {
    console.log("+-----+ +-----+");
    console.log(`|  A  | |  Q  |`);
    console.log("|     | |     |");
    console.log(`|  ${Card.SYMBOLS[2]}  | |  ${Card.SYMBOLS[3]}  |`);
    console.log("+-----+ +-----+");
    console.log('');
  }

  displayPurse() {
    console.log(`Current Purse: $${this.player.purse}`);
  }

  displayGoodbyeMessage() {
    console.log('Thank you for playing Twenty-One! Goodbye!');
  }

  displayResult() {
    //STUB
  }

  clearLastLine() {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
  }

  promptToStart() {
    let response = readline.question("=> Enter 'S' to play or 'Q' to quit.: ").toLowerCase();
    while (!['s', 'start', 'q', 'quit'].includes(response)) {
      response = readline.question("Invalid Response. Please enter 'S' or 'Start' to play, or enter 'Q' or 'Quit' to quit.: ").toLowerCase();
    }
    return response;
  }
}

let game = new TwentyOneGame();
game.start();