const { randomBytes, createDecipheriv, createCipheriv } = require('lesson-5/1/src/utils/crypto')

const algorithm = 'aes-256-cbc';
const initVector = randomBytes(16);
const Securitykey = randomBytes(32);

const encrypt = (data, encoding, format) => {
  const cipher = createCipheriv(algorithm, Securitykey, initVector);

  let encryptedData = cipher.update(data, encoding, format);
  encryptedData += cipher.final(format);

  return encryptedData;
}

const decrypt = (data, encoding, format) => {
  const decipher = createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(data, format, encoding);
  decryptedData += decipher.final(encoding);

  return decryptedData;
}

module.exports = {
  encrypt,
  decrypt,
};
