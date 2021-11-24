const { randomBytes, createCipheriv } = require('crypto')

const algorithm = 'aes-256-cbc'
const initVector = randomBytes(16)
const Securitykey = randomBytes(32)

const encrypt = (data, encoding, format) => {
  const cipher = createCipheriv(algorithm, Securitykey, initVector);

  let encryptedData = cipher.update(data, encoding, format);
  encryptedData += cipher.final(format);

  return encryptedData
}

module.exports = {
  encrypt,
};
