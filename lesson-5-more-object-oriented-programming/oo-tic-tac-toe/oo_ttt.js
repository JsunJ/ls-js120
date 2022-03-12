let readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter++) {
      this.squares[counter] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.isUnusedSquare(key));
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
    this.name = 'You';
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
    this.name = 'Computer';
  }
}

class TTTGame {
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];
  static FULL_ROW_COUNT = 3;
  static SCORE_LIMIT = 3;

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.scores = {};
    this.firstPlayer = this.human;
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    if (['q', 'quit'].includes(this.promptToStart())) return;

    this.playMatch();

    this.displayGoodbyeMessage();
  }

  playMatch() {
    this.initializaeScores();
    this.refreshDisplay();

    while (true) {
      this.playRound();
      if (this.scoreLimitReached() || !this.playAgain()) {
        break;
      }
      this.firstPlayer = this.togglePlayer(this.firstPlayer);
    }

    this.displayMatchResult();
  }

  playRound() {
    let currentPlayer = this.firstPlayer;
    while (true) {
      this.refreshDisplay();

      this.playerMoves(currentPlayer);
      this.refreshDisplay();
      if (this.gameOver()) break;
      currentPlayer = this.togglePlayer(currentPlayer);
    }

    this.updateScores();
    this.refreshDisplay();
    this.displayResults();
  }

  playAgain() {
    let choice = readline.question('Would you play to play again? (Y/N): ').toLowerCase();
    while (!['y', 'yes', 'n', 'no'].includes(choice)) {
      choice = readline.question("Invalid Response. Please enter 'Yes' / 'Y' to play again, enter or 'No' / 'N' to exit.: ").toLowerCase();
    }

    if (choice === 'y' || choice === 'yes') {
      this.resetBoard();
    }

    return ['y', 'yes'].includes(choice);
  }

  resetBoard() {
    this.board = new Board();
  }

  initializaeScores() {
    this.scores[this.human.name] = 0;
    this.scores[this.computer.name] = 0;
  }

  updateScores() {
    if (this.isWinner(this.human)) {
      this.incrementScore(this.human);
    } else if (this.isWinner(this.computer)) {
      this.incrementScore(this.computer);
    }
  }

  scoreLimitReached() {
    return this.scores[this.human.name] === TTTGame.SCORE_LIMIT ||
           this.scores[this.computer.name] === TTTGame.SCORE_LIMIT;
  }

  refreshDisplay() {
    console.clear();
    console.log('');
    this.displayScores();
    this.board.display();
  }

  promptToStart() {
    let response = readline.question("Enter 'S' to start the match or 'Q' to quit.: ").toLowerCase();
    while (!['s', 'start', 'q', 'quit'].includes(response)) {
      response = readline.question("Invalid Response. Please enter 'S' or 'Start' to start the match, or enter 'Q' or 'Quit' to quit the game.: ").toLowerCase();
    }
    return response;
  }

  displayWelcomeMessage() {
    console.log("");
    console.log(`Welcome to Tic Tac Toe! The first to ${TTTGame.SCORE_LIMIT} between you and the computer will win the game!`);
    console.log("");
    console.log("     |     |");
    console.log("  X  |  O  |  X");
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log("  O  |  X  |  O");
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log("  X  |  O  |  X");
    console.log("     |     |");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayScores() {
    console.log(`Score: You ${this.scores['You']} | Computer ${this.scores['Computer']}`);
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won this round!");
    } else if (this.isWinner(this.computer)) {
      console.log("This round goes to me!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  displayMatchResult() {
    if (this.isMatchWinner(this.human)) {
      console.log("You won the match! Congratulations!");
    } else if (this.isMatchWinner(this.computer)) {
      console.log("I won the match! Take that, human!");
    }

    console.log(`Final Score: You ${this.scores['You']} | Computer ${this.scores['Computer']}`);
  }

  joinOr(arr, delimiter = ', ', joinWord = 'or') {
    switch (arr.length) {
      case 1: return arr[0];
      case 2: return arr.join(` ${joinWord} `);
      default: return arr.slice(0, arr.length - 1).join(delimiter) +
                      `${delimiter}${joinWord} ${arr[arr.length - 1]}`;
    }
  }

  togglePlayer(currentPlayer) {
    return currentPlayer === this.human ? this.computer : this.human;
  }

  playerMoves(currentPlayer) {
    if (currentPlayer === this.human) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${this.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let choice = this.computerOffensiveMove();

    if (!choice) {
      choice = this.computerDefensiveMove();
    }

    if (!choice) {
      choice = this.computerMiddleMove();
    }

    if (!choice) {
      choice = this.computerRandomMove();
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  computerDefensiveMove() {
    return this.findSquareOfInterestKey('defensive');
  }

  computerOffensiveMove() {
    return this.findSquareOfInterestKey('offensive');
  }

  computerMiddleMove() {
    if (this.board.isUnusedSquare('5')) return '5';
    return null;
  }

  computerRandomMove() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    return choice;
  }

  findSquareOfInterestKey(posture) {
    for (let index = 0; index < TTTGame.POSSIBLE_WINNING_ROWS.length; index++) {
      let currentRow = TTTGame.POSSIBLE_WINNING_ROWS[index];
      let currentKey = this.determineSquareOfInterest(posture, currentRow);
      if (currentKey) return currentKey;
    }
    return null;
  }

  determineSquareOfInterest(posture, row) {
    if (posture === 'defensive') {
      if (this.board.countMarkersFor(this.human, row) === 2) {
        let squareOfInterestKey = row.find(key => {
          return this.board.isUnusedSquare(key);
        });
        if (squareOfInterestKey) return squareOfInterestKey;
      }
    } else if (posture === 'offensive') {
      if (this.board.countMarkersFor(this.computer, row) === 2) {
        let squareOfInterestKey = row.find(key => {
          return this.board.isUnusedSquare(key);
        });
        if (squareOfInterestKey) return squareOfInterestKey;
      }
    }
    return null;
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === TTTGame.FULL_ROW_COUNT;
    });
  }

  incrementScore(player) {
    if (this.scores[player.name]) {
      this.scores[player.name] += 1;
    } else {
      this.scores[player.name] = 1;
    }
  }

  isMatchWinner(player) {
    return this.scores[player.name] === TTTGame.SCORE_LIMIT;
  }
}

let game = new TTTGame();
game.start();