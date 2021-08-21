const { Writable } = require('stream');

class MyWritableStream extends Writable {

}

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

process.stdin.pipe(outStream);

// the chunk is usually a buffer unless we configure the stream differently

// the encoding argument is needed in that case, but usually we ignore it.

// the callback is a function that we need to call after we're done processing the data chunk.
// It's what signals whether the write was successful or not. To signal a failure, call the callback
// with an error object
