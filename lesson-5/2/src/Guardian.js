const { Transform } = require('stream');
const { encrypt, signCertificate } = require('./utils/crypto');

const ALGORITHM = 'hex';

class Guardian extends Transform {
  constructor(options = {}) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    const encryptedEmail = encrypt(chunk.email, encoding, ALGORITHM);
    const encryptedPassword = encrypt(chunk.password, encoding, ALGORITHM);

    const data = {
      payload: {
        ...chunk,
        email: encryptedEmail,
        password: encryptedPassword,
      },
      meta: {
        source: 'ui',
      },
    }
    data.meta.signature = signCertificate(data.payload);

    this.push(data);

    done();
  }
}

module.exports = Guardian;
