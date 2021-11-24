const { Writable } = require('stream');

class AccountManager extends Writable {
  #data = [];

  constructor(options = { objectMode: true }) {
    super(options);
  }

  _write(chunk, encoding, done) {
    this.#data.push(chunk)
    console.log(this.#data);
    done();
  }
}

module.exports = AccountManager;
