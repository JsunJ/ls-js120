const readline = require('readline-sync');
const shuffle = require('shuffle-array');

class Card {
  static SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
  static SYMBOLS = ['♣', '♦', '♥', '♠'];

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  toString() {
    return ` ${this.getRank()} of ${this.getSuit()}`;
  }

  getRank() {
    return this.rank;
  }

  getSuit() {
    return this.suit;
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

  deal() {
    return this.cards.pop();
  }
}

class Player {
  static STARTING_PURSE = 5;
  static WINNING_PURSE = 10;

  constructor() {
    this.purse = Player.STARTING_PURSE;
    this.hand = [];
  }

  isRich() {
    return this.purse >= Player.WINNING_PURSE;
  }

  isBroke() {
    return this.purse <= 0;
  }
}

class Dealer {
  constructor() {
    this.hand = [];
  }
}

class TwentyOneGame {
  static PURSE_LIMIT = 10;
  static BUST_LIMIT = 21;
  static DEALER_HIT_LIMIT = 17;

  constructor() {
    this.player = new Player();
    this.dealer = new Dealer();
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    if (['q', 'quit'].includes(this.promptToStart())) return;

    while (true) {
      this.displayPurse();
      this.playRound();

      this.displayResult();

      break;
    }
    this.displayGoodbyeMessage();
  }

  dealCards() {
    this.player.hand.push(this.deck.deal());
    this.dealer.hand.push(this.deck.deal());
    this.player.hand.push(this.deck.deal());
    this.dealer.hand.push(this.deck.deal());
  }

  hit(player) {
    player.hand.push(this.deck.deal());
  }

  displayHands() {
    console.log('');
    console.log(` Dealer's Hand: *HIDDEN CARD* |${this.dealer.hand.slice(1, this.dealer.hand.length)}`);
    console.log('');
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
    console.log('');
    console.log(` Your Hand:${this.player.hand.join(' |')}`);
    this.displayHandValue(this.player);
    console.log('');
  }

  displayFinalHands() {
    console.log('');
    console.log(` Dealer Hand:${this.dealer.hand.join(' |')}`);
    this.displayHandValue(this.dealer);
    console.log('');
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
    console.log('');
    console.log(` Your Hand:${this.player.hand.join(' |')}`);
    this.displayHandValue(this.player);
    console.log('');
  }

  displayHandValue(player) {
    console.log(` Total: ${this.getHandValue(player)}`);
  }

  getHandValue(player) {
    let cardValues = player.hand.map(card => card.rank);

    let cardSum = 0;
    cardValues.forEach(value => {
      if (value === 'Ace') {
        cardSum += 11;
      } else if (['Jack', 'Queen', 'King'].includes(value)) {
        cardSum += 10;
      } else {
        cardSum += Number(value);
      }
    });

    cardValues.filter(value => value === 'A').forEach(_ => {
      if (cardSum > TwentyOneGame.BUST_LIMIT) cardSum -= 10;
    });

    return cardSum;
  }

  playerTurn() {

  }

  dealerTurn() {
    //STUB
  }

  isBusted(player) {
    return this.getHandValue(player) > TwentyOneGame.BUST_LIMIT;
  }

  playRound() {
    this.deck = new Deck();
    this.dealCards();
    this.displayHands();
    this.playerTurn();
    this.dealerTurn();


  }

  hitOrStay() {
    prompt('Hit or Stay?');
    let answer = readline.question().toLowerCase();
    while (!['h', 'hit', 's', 'stay'].includes(answer)) {
      prompt("Invalid choice. Please enter 'h' or 'hit' to hit, or enter 's' or 'stay' to stay.");
      answer = readline.question().toLowerCase();
    }
    return answer;
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

  prompt(msg) {
    console.log(`=> ${msg}`);
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