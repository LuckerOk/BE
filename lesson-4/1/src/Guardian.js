const { Transform } = require('stream');
const { createHmac } = require('crypto');

class Guardian extends Transform {
  #secret = 'secret';

  constructor(options = { objectMode: true }) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    const emailHash = createHmac('sha256', this.#secret)
      .update(chunk.email)
      .digest();
    const passwordHash = createHmac('sha256', this.#secret)
      .update(chunk.password)
      .digest('hex');

    this.push({ ...chunk, email: emailHash, password: passwordHash });

    done();
  }
}

module.exports = Guardian;
