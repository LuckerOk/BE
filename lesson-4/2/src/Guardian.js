const { Transform } = require('stream');
const { encrypt } = require('./crypto');

class Guardian extends Transform {
  constructor(options = {}) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    const encryptedEmail = encrypt(chunk.email, encoding, 'base64');
    const encryptedPassword = encrypt(chunk.password, encoding, 'hex');

    this.push({ ...chunk, email: encryptedEmail, password: encryptedPassword });

    done();
  }
}

module.exports = Guardian;
