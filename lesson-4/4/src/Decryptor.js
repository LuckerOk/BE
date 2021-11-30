const { Transform } = require('stream');
const { decrypt } = require('./crypto');
const { validateEncodedData } = require('./validator');

class Decryptor extends Transform {
  constructor(options = { objectMode: true }) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    validateEncodedData(chunk);
    const decryptedEmail = decrypt(chunk.payload.email, encoding, chunk.meta.algorithm);
    const decryptedPassword = decrypt(chunk.payload.password, encoding, chunk.meta.algorithm);

    this.push({ ...chunk.payload, email: decryptedEmail, password: decryptedPassword });

    done();
  }
}

module.exports = Decryptor;
