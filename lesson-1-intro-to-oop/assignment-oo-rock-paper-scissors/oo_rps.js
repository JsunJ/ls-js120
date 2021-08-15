const readline = require('readline-sync');
const prompt = msg => console.log(`\n=> ${msg}`);

function createPlayer() {
  return {
    move: null,
    score: 0,
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        prompt('Please enter your choice of either rock, paper, scissors, lizard, or spock:');
        choice = readline.question();
        if (['rock', 'paper', 'scissors', 'lizard', 'spock'].includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };

  return Object.assign(playerObject, computerObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  maxScore: 5,
  choices: {
    rock: {
      winsAgainst: ['scissors', 'lizard'],
    },

    paper: {
      winsAgainst: ['rock', 'spock'],
    },

    scissors: {
      winsAgainst: ['paper', 'lizard'],
    },

    lizard: {
      winsAgainst: ['paper', 'spock'],
    },

    spock: {
      winsAgainst: ['rock', 'scissors'],
    },
  },

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Rock, Paper, Scissors, Lizard, Spock! (RPSLS)');
    console.log('You will be playing against a computer. The first to win 5 rounds will win the game!');
  },

  promptToContinue() {
    prompt(`Enter 'C' to continue.`);
    let response = readline.question().toLowerCase();
    while (response !== 'c') {
      prompt(`Please enter 'C' to continue the game.`);
      response = readline.question().toLowerCase();
    }
  },

  displayCurrentScores() {
    console.clear();
    console.log(`Current Scores: YOU = ${this.human.score} | COMPUTER = ${this.computer.score}`);
  },

  displayRoundWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`\nYou chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);

    if (this.choices[humanMove].winsAgainst.includes(computerMove)) {
      console.log('You win this round!');
      this.human.score += 1;
    } else if (this.choices[computerMove].winsAgainst.includes(humanMove)) {
      console.log('The computer wins this round!');
      this.computer.score += 1;
    } else {
      console.log("It's a tie!");
    }
  },

  displayGameWinner() {
    if (this.human.score === this.maxScore) {
      console.log(`\nYou win the game!`);
    } else {
      console.log(`\nThe computer wins the game!`);
    }
  },

  playAgain() {
    prompt('Would you like to play again? (Y / N)');
    let answer = readline.question().toLowerCase();
    while (answer !== 'y' && answer !== 'n') {
      prompt("Please enter 'Y' for yes or 'N' for no.");
      answer = readline.question().toLowerCase();
    }
    return answer;
  },

  resetScores() {
    this.human.score = 0;
    this.computer.score = 0;
  },

  displayGoodbyeMessage() {
    console.log('\nThank you for playing Rock, Paper, Scissors, Lizard, Spock. Goodbye!');
  },

  play() {
    this.displayWelcomeMessage();
    this.promptToContinue();
    while (true) {
      this.displayCurrentScores();
      this.human.choose();
      this.computer.choose();
      this.displayRoundWinner();
      this.promptToContinue();
      if (this.human.score === this.maxScore ||
          this.computer.score === this.maxScore) break;
    }
    this.displayGameWinner();
    if (this.playAgain() === 'y') {
      this.resetScores();
      this.play();
    } else {
      this.displayGoodbyeMessage();
    }
  },
};

RPSGame.play();

// TO DO
/*
  factory functions for moves
  shorthand for moves
*/