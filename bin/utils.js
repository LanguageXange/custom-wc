import chalk from "chalk";

//

function printText(text, hexcolor = "#08adff") {
  console.log(chalk.hex(hexcolor).bold(text));
}

function printResult(number, unit, hexColor = "#08adff") {
  const result = `Your file has ${number} ${unit}(s) \n`;
  console.log(chalk.hex(hexColor).bold(result));
}

// count new lines so we need to subtract 1
function countLines(contents) {
  return contents ? contents.split("\n").length - 1 : 0;
}

function countWords(contents) {
  return contents ? contents.trim().split(/\s+/g).length : 0;
}

function countChar(contents) {
  return contents.length;
}

// exporting all the util functions;

export { countLines, printText, countWords, countChar, printResult };
