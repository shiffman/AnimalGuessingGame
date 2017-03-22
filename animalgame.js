// 8 nights of Hanukkah 2016 Examples
// Night 5: Animal Guessing Game
// https://www.reddit.com/r/dailyprogrammer/comments/34asls/20150429_challenge_212_intermediate_animal_guess/
// Daniel Shiffman
// http://codingrainbow.com/

//don't forget about the ;!

var readlineSync = require('readline-sync');
var tree = require('./tree');
var util = require('./util');

// Add some encouragement
var words = ["That's great!", "You know your animals!", "Let's play again!", "One more animal!"];

// Giving thanks
var thanks = ["Thanks!", "Nice one!"];

// Play again
var playAgain = ["Let's play again!", "That was fun, let's play again!"];

tree.loadFile('tree.json', function (err, root) {
  if (err) return console.error(err);

  console.log('Welcome to the animal game!');
  console.log('This game is a lot of fun!');
  console.log('Think of an animal,');
  console.log('\tthen I will try to guess it!');
  console.log('If I do not know know your animal you can teach me!\n');

  // Play the game
  play();

  function play() {
    if (ask("Do you want to play?")) {
      go(root);
    }
  }

  function go(node) {
    // If it's not a "terminal" node (i.e. animal)
    if (node.yes && node.no) {
      // Ask the question: Yes or No?
      if (ask(node.message)) {
        go(node.yes);
      } else {
        go(node.no);
      }
    }
    // We're at the end, guess!
    else if (ask("Is it a " + node.message + "?")) {
      // Right!
      console.log(util.randomPicker(words));
      play();
    } else {
      // Wrong!
      train(node);
    }
  }

  // Ask a question, return true for yes
  function ask(question) {
    var answer = readlineSync.question(question + " (Y/n): ").toUpperCase();
    return (answer.charAt(0) != "N");
  }

  // Train a node to get the right answer
  function train(node) {
    if (ask('No?! I\'m very curious! Can you tell me what you are?')) {
      // The wrong guess
      var guess = node.message;
      // What is it?
      var answer = readlineSync.question("Ok, what are you? ");
      // Get a new question?
      var question = readlineSync.question("Suggest a yes/no question to distinguish a " + guess + " from a " + answer + ".\n");
      
      node.message = question;
      // Yes or no for that question
      if (ask("Answer for a " + answer + ": " + question)) {
        node.yes = tree.node(answer);
        node.no = tree.node(guess);
        console.log(util.randomPicker(thanks));
        console.log ("Great! Now I know about " + answer + "s !");
        console.log(util.randomPicker(playAgain));
      } else {
        node.yes = tree.node(guess);
        node.no = tree.node(answer);
        //adding it here did not gen a thanks
        //console.log(util.randomPicker(thanks));
      }

      // Save back to the file
      tree.writeFile('tree.json', root, function (err) {
        if (err) console.warn(err);
        play();
      });
    }
    else {
      play();
    }  
  }
});