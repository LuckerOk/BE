const zlib = require('zlib');

class Archiver {
  #algorithm = 'gzip';

  constructor({ algorithm }) {
    this.#algorithm = algorithm;
  }

  archive() {
    if (this.#algorithm === 'deflate') {
      return zlib.createDeflate();
    }

    return zlib.createGzip();
  }

  unarchive() {
    if (this.#algorithm === 'deflate') {
      return zlib.Inflate();
    }

    return zlib.createGunzip();
  }
}

module.exports = Archiver;
