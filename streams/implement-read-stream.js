const { Readable } = require('stream');

// const inStream = new Readable({
//   read() {}
// });

// inStream.push('TESTING STREAM 1');
// inStream.push("TESTING STREAM 2");

// inStream.push(null);

const inStream = new Readable({
  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));
    if (this.currentCharCode > 90) {
      this.push(null);
    }
  }
})
inStream.currentCharCode = 65;

inStream.pipe(process.stdout);