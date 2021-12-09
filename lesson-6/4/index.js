const { pipeline } = require('stream');
const fs = require('fs');
const Json2csv = require('./src/Json2csv');
const Archiver = require('./src/Archiver');

const usersReadableStream = fs.createReadStream('./src/data/users.json');
const usersWritableStream = fs.createWriteStream('./src/data/users.csv');
const fields = ['postId', 'name', 'body'];

const json2csv = new Json2csv(fields);
const archiver = new Archiver({ algorithm: 'deflate' });

pipeline(
  usersReadableStream,
  json2csv,
  archiver.archive(),
  archiver.unarchive(),
  usersWritableStream,
  (err) => {
    err ? console.log('Pipeline failed.', err) : console.log('Pipeline succeeded.');
  }
)
