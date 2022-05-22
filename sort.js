const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('pays.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  a = 1
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`<option value="${a}">${line}</option>`);
    a++

  }
}

processLineByLine();