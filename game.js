// Guessing Game

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  this.hintNumbers;
}


Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};


Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};


Game.prototype.playersGuessSubmission = function(num) {
  var header1 = $('#header1');
  if ( num < 1 || num > 100 || !Number.isInteger(num) ) {
    var invalidMessage = "That is an invalid guess!";
    header1.text(invalidMessage).css('color', 'red');
    throw invalidMessage;
  }
  else {
    this.playersGuess = num;
    var displayText = this.checkGuess();  //  displayText is an array with indexes: [<title text>, <text color>, <subtitle text (only defined if player wins or loses)>]
    header1.text(displayText[0]).css('color', displayText[1]);
    var displaySubText = this.isLower() ? "Guess Higher!" : "Guess Lower!";
    console.log(displayText[2]);
    $('#header2').text(displayText[2] || displaySubText).css('color', displayText[1]);
    if (displayText[2])  // if player has won/lost and special text is displayed, disable the input.
      $('#player-input').attr('disabled', true);
  }
};


Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
      $('#submitButton, #hintButton').attr('disabled', true);
      return ["You Win!", 'yellow', "Nice job!"];
    }
    else if (this.pastGuesses.indexOf(this.playersGuess) !== -1)
      return ["You have already guessed that number.", 'red'];
    else {
      // show guess in list:
      this.pastGuesses.push(this.playersGuess);
      currentGuess = this.pastGuesses.length;
      var guessList = $('.guess');
      $(guessList[currentGuess-1]).text(this.playersGuess);
      // determine message to give player:
      if (currentGuess === 5) {
        $('#submitButton, #hintButton').attr('disabled', 'disabled');
        return ["You Lose.", 'black', "Try again!"];
      }
      else if ( this.difference() < 10 )
        return ["You\'re burning up!", '#e24a1f'];
      else if ( this.difference() < 25 )
        return ["You\'re lukewarm.", '#e0901a'];
      else if ( this.difference() < 50 )
        return ["You\'re a bit chilly.", '#2aefef'];
      else
        return ["You\'re ice cold!", '#3193b7'];
  }
  var displayText = determineDisplayText();
  header1.text(displayText).css({'color': textColor});
  return displayText;
};

Game.prototype.provideHint = function() {
  var arr = [];
  arr.push( this.winningNumber, generateWinningNumber(), generateWinningNumber() );
  return shuffle(arr);
};


function newGame() {
  return new Game();
}


function generateWinningNumber() {
  var randomNum = Math.floor( Math.random()*100 )+ 1;
  while (randomNum !== this.winningNumber)
    return randomNum;
}

// Fisher–Yates Shuffle function (shuffling an array in place)
function shuffle(arr) {
  var m = arr.length, i, temp;   //  m = the last unsorted element in array
  while (m) {    // when there are no more unsorted elements, m will equal 0
    i = Math.floor(Math.random() * m--);  // i = randomly selected unsorted element
    // swap elements m and i.
    temp = arr[m];
    arr[m] = arr[i];
    arr[i] = temp;
  }
  return arr;
}


function processGuess(game) {
  var inputObj = $('#player-input');
  var guessValue = +inputObj.val();
  inputObj.val("");
  console.log(inputObj, guessValue);
  console.log( game.playersGuessSubmission(guessValue) );
}


$(document).ready(function() {
  var currentGame = newGame();
  $('#submitButton').click(function(){ processGuess(currentGame); });
  $('#player-input').keyup(function(e){
    if (e.keyCode === 13){ processGuess(currentGame); } });   // if player presses return key.
  $('#player-input').keydown(function() {
    var goodLuck = $('#goodLuck');
    if (goodLuck.css('display') === 'none') { goodLuck.slideDown(); }
  });
  $('#resetButton').click(function() {
    currentGame = newGame();
    $('#header1').text("What Number Am I Thinking Of?").css('color', 'white');
    $('#header2').text("Pick A Number, 1 to 100!").css('color', '#16ba19');
    $('.guess').text("(?)");
    $('#player-input').val("");
    $('#goodLuck').css({'display': 'none'});
    $('#submitButton, #hintButton, #player-input').attr('disabled', false);
   });
  $('#hintButton').click(function() {
    if (!currentGame.hintNumbers) { currentGame.hintNumbers = currentGame.provideHint(); }
    $('#header1').css('display', 'none').text(`The winning number is either ${currentGame.hintNumbers[0]}, ${currentGame.hintNumbers[1]}, or ${currentGame.hintNumbers[2]}`).css('color', '#a316e0').fadeIn(1000);
  });
});
