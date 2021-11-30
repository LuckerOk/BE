const { randomBytes, createDecipheriv, createCipheriv, createSign, createVerify } = require('crypto');
const { PRIVATE_KEY, PUBLIC_KAY } = require('../constants/keys');

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

const signCertificate = (data) => {
  const sign = createSign('SHA256');
  sign.update(JSON.stringify(data));
  sign.end();

  return sign.sign(PRIVATE_KEY).toString('base64');
}

const verifySign = (data, signature) => {
  const verify = createVerify('SHA256');
  verify.update(JSON.stringify(data));
  verify.end();

  return verify.verify(PUBLIC_KAY, Buffer.from(signature, 'base64'));
}

module.exports = {
  encrypt,
  decrypt,
  signCertificate,
  verifySign,
};
