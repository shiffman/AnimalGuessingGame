// 8 nights of Hanukkah 2016 Examples
// Night 5: Animal Guessing Game
// https://www.reddit.com/r/dailyprogrammer/comments/34asls/20150429_challenge_212_intermediate_animal_guess/
// Daniel Shiffman
// http://codingrainbow.com/

// Node has data and a yes (left) and no (right) answer
function Node(data, y, n) {
  this.data = data;
  this.yes = y;
  this.no = n;
}

var readlineSync = require('readline-sync');
var fs = require("fs");
//add some encouragement//
var words = ["That's great!", "You know your animals!", "Let's play again!", "One more animal!"];
var word = words[Math.floor(Math.random() * words.length)];



// Read in an animal decision tree
var tree = fs.readFileSync('tree.json');
var root = JSON.parse(tree);
var node;

console.log('Welcome to the animal game!\nThis game is a lot of fun!\nThink of an animal,\nthen I will try to guess it!\nIf I do not know know your animal you can teach me!\nReady to play?!');

// Play the game
while (ask("Do you want to play?")) {
  node = root;
  go();
}

function go() {
  // If it's not a "terminal" node (i.e. animal)
  while (node.yes && node.no) {
    // Ask the question: Yes or No?
    if (ask(node.data)) {
      node = node.yes;
    } else {
      node = node.no;
    }
  }
  // We're at the end, guess!
  if (!ask("Is it a " + node.data + "?")) {
    // Wrong!
    train(node);
  } else {
    // Right!
    console.log(word);
  }
}

// Ask a question, return true for yes
function ask(question) {
  var answer = readlineSync.question(question + " (y/n): ").toUpperCase();
  return (answer.charAt(0) == "Y");
}

// Train a node to get the right answer
function train(node) {
  // The wrong guess
  var guess = node.data;
  // What is it?
  var answer = readlineSync.question("Ok, what are you? ");
  // Get a new question?
  var question = readlineSync.question("Suggest a yes/no question to distinguish a " + guess + " from a " + answer + ".\n");
  node.data = question;
  // Yes or no for that question
  if (ask("Answer for a " + answer + ": " + question)) {
    node.yes = new Node(answer);
    node.no = new Node(guess);
  } else {
    node.yes = new Node(guess);
    node.no = new Node(answer);
  }
  // Save back to the file
  var tree = JSON.stringify(root, null, 2);
  fs.writeFileSync('tree.json', tree);
}
