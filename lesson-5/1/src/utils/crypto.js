const { randomBytes, createDecipheriv, createCipheriv } = require('crypto')

const algorithm = 'aes-256-cbc';
const initVector = randomBytes(16);
const securitykey = randomBytes(32);

const encrypt = (data, encoding, format) => {
  const cipher = createCipheriv(algorithm, securitykey, initVector);

  let encryptedData = cipher.update(data, encoding, format);
  encryptedData += cipher.final(format);

  return encryptedData;
}

const decrypt = (data, encoding, format) => {
  const decipher = createDecipheriv(algorithm, securitykey, initVector);

  let decryptedData = decipher.update(data, format, encoding);
  decryptedData += decipher.final(encoding);

  return decryptedData;
}

module.exports = {
  encrypt,
  decrypt,
};
