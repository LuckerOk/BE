const { Transform } = require('stream');
const DB = require('./DB');

class Logger extends Transform {
  #db = new DB();

  constructor(options = { objectMode: true }) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    this.#db.emit('add', {
      source: 'Ui',
      payload: chunk,
    });

    done();
  }
}

module.exports = Logger;
