const { Transform } = require('stream');
const { encrypt } = require('./crypto');

const ALGORITHM = 'hex';

class Guardian extends Transform {
  constructor(options = { objectMode: true }) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    console.log(chunk)
    const encryptedEmail = encrypt(chunk.email, encoding, ALGORITHM);
    const encryptedPassword = encrypt(chunk.password, encoding, ALGORITHM);

    this.push({
      payload: {
        ...chunk,
        email: encryptedEmail,
        password: encryptedPassword,
      },
      meta: {
        algorithm: ALGORITHM
      },
    });

    done();
  }
}

module.exports = Guardian;
