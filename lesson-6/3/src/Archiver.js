const zlib = require('zlib');

class Archiver {
  archive() {
    return zlib.createGzip();
  }

  unarchive() {
    return zlib.createGunzip();
  }
}

module.exports = Archiver;
