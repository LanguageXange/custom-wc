#!/usr/bin/env node
import fs from "fs";
import chalk from "chalk";
import {
  countLines,
  countWords,
  countChar,
  printText,
  printResult,
} from "./utils.js";

const colorMap = {
  green: "#98e3ac",
  blue: "#9cdff7",
  purple: "#b54fe8",
  yellow: "#ffe91f",
};

const welcomeText = `Welcome! type coolwc -h to find all commands. \n`;
const helpText = `
----List of all commands----
coolwc filename
coolwc -h (display a list of all commands)
coolwc -c filename (to print the byte counts)
coolwc -l filename (to print the newline counts)
coolwc -w filename (to print the word counts)
coolwc -m filename (to print the character counts)
cat filename | coolwc -c
cat filename | coolwc -l
cat filename | coolwc -w
cat filename | coolwc -m
-----------------------------
`;
printText(welcomeText, "#f51767");

const args = process.argv.slice(2);

// coolwc --help filename
// coolwc filename
// if no option provided - return all ( -c, -l -w)
// if no filename provided - allow standard input; e.g. cat test.txt | coolwc
let option = null;
let filename = null;

let fileSize = 0;
let lines = 0;
let words = 0;
let chars = 0;
let contents = null;

// TODO - handle more use cases; refactor the code
function handleArgs(args) {
  if (!args.length) {
    throw new Error("Invalid input");
  }

  // need to handle "cat filename | coolwc -l"  and "coolwc filename"
  if (args.length == 1) {
    if (args[0].includes("-")) {
      option = args[0];
    } else {
      filename = args[0];
    }
  }
  if (args.length >= 2) {
    option = args[0];
    filename = args[1];
  }
}

function displayResults(option) {
  // if no option provided; print all and return;
  if (!option) {
    printResult(fileSize, "byte", colorMap.blue);
    printResult(lines, "line", colorMap.green);
    printResult(words, "word", colorMap.yellow);
    printResult(chars, "chars", colorMap.purple);
    return;
  }
  switch (option) {
    case "-c":
      printResult(fileSize, "byte", colorMap.blue);
      break;
    case "-l":
      printResult(lines, "line", colorMap.green);
      break;
    case "-w":
      printResult(words, "word", colorMap.yellow);
      break;
    case "-m":
      printResult(chars, "character", colorMap.purple);
      break;
    default:
      throw new Error("option is not valid");
  }
}

async function coolwc() {
  try {
    handleArgs(args);

    if (option === "-h") {
      printText(helpText);
      return;
    }
    if (filename) {
      fileSize = fs.statSync(filename).size;
      contents = fs.readFileSync(filename, "utf8");
    } else {
      // accepts standard input if no file specified;
      const buffer = fs.readFileSync(0);
      fileSize = buffer.length;
      contents = buffer.toString();
    }
    // helper function to help us calculate lines, words, character
    lines = countLines(contents);
    words = countWords(contents);
    chars = countChar(contents);

    displayResults(option);
  } catch (err) {
    console.log(chalk.red(`Ooops! ${err.message}`));
  }
}

await coolwc();
