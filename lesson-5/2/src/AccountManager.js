const { Writable } = require('stream');
const { verifySign } = require('./utils/crypto');

class AccountManager extends Writable {
  #data = [];

  constructor(options = {}) {
    super(options);
  }

  _write(chunk, encoding, done) {
    console.log(verifySign(chunk.payload, chunk.meta.signature));
    this.#data.push(chunk);

    done();
  }
}

module.exports = AccountManager;
