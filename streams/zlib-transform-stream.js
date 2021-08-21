const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGzip)
  .pipe(fs.createWriteStream(file + '.gz'));

// The cool thing
fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .on('data', () => process.stdout.write('.'))
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', () => console.log('\nDone.'));

  // More readable code

const { Transform } = require('stream');

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.');
    callback(null, chunk);
  }
});

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.gzx'))
  .on('finish', () => console.log('\nDone.'));


// we can encrypts file content before we create a zip file 
const crypto = require('crypto');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encryptProgress = new Transform({
  transform(chunk, encoding, callback) {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encryptedData = cipher.update(chunk.toString(), 'utf8') + cipher.final('utf-8');
    callback(null, encryptedData);
  }
})

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(encryptProgress)
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', () => console.log('\nDone'));

// Unzip file and Decrypted content
const decryptProgress = new Transform({
  transform(chunk, encoding, callback) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    const decryptedData = decipher.update(chunk.toString(), 'base64') + decipher.final('utf-8');
    callback(null, decryptedData);
  }
});

// fs.createReadStream(file + '.gz')
//   .pipe(decryptProgress)
//   .pipe(zlib.createGunzip())
//   .pipe(reportProgress)
//   .pipe(fs.createWriteStream(file + '.result'))
//   .on('error', (e) => console.log('error: ', e))
//   .on('finish', () => console.log('\nDone'));