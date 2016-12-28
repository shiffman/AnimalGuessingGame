function Node(data, y, n) {
  this.data = data;
  this.yes = y;
  this.no = n;
}

var readlineSync = require('readline-sync');
var fs = require("fs");

var tree = fs.readFileSync('tree.json');
var root = JSON.parse(tree);
var node;

console.log('Welcome to the animal game!');

while (ask("Do you want to play?")) {
  node = root;
  go();
}

function go() {
  while (node.yes && node.no) {
    if (ask(node.data)) {
      node = node.yes;
    } else {
      node = node.no;
    }
  }
  if (!ask("Is it a " + node.data + "?")) {
    train(node);
  } else {
    console.log("Yay!");
  }
}

function ask(question) {
  var answer = readlineSync.question(question + " (y/n): ").toUpperCase();
  return (answer.charAt(0) == "Y");
}

function train(node) {
  var guess = node.data;
  var answer = readlineSync.question("Ok, what are you? ");
  var question = readlineSync.question("Suggest a yes/no question to distinguish a " + guess + " from a " + answer + ".\n");
  node.data = question;
  if (ask("Answer for a " + answer + ": " + question)) {
    node.yes = new Node(answer);
    node.no = new Node(guess);
  } else {
    node.yes = new Node(guess);
    node.no = new Node(answer);
  }
  var tree = JSON.stringify(root, null, 2);
  fs.writeFileSync('tree.json', tree);
}
