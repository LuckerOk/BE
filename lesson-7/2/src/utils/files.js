const path = require('path');
const { createGzip } = require('zlib');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');
const fsPromises = require('fs/promises');

const Json2csv = require('./src/Json2csv');
const { ENCODING, resUsersCsvPath, resUsersGzPath } = require('../constants');

const formatToCsv = async (users) => {
  const json2csv = new Json2csv()
  const csvData = json2csv.transform(users);

  await fsPromises.writeFile(path.resolve(resUsersCsvPath), csvData, ENCODING);

  return csvData;
};

const archive = async (source) => {
  const gzip = createGzip();
  const destination = createWriteStream(path.resolve(resUsersGzPath));

  await pipeline(source, gzip, destination);

  return fsPromises.readFile(path.resolve(resUsersGzPath), ENCODING);
};

module.exports = {
  formatToCsv,
  archive,
};
