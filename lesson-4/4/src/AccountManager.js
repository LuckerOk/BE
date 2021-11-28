const { Writable } = require('stream');

class AccountManager extends Writable {
  #data = [];

  constructor(options = { objectMode: true }) {
    super(options);
  }

  _write(chunk, encoding, done) {
    console.log(AccountManager.name, chunk);
    this.#data.push(chunk);

    done();
  }
}

module.exports = AccountManager;
