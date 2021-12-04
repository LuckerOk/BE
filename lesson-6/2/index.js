const { pipeline } = require('stream');
const fs = require('fs');
const Json2csv = require('./src/Json2csv');

const usersReadableStream = fs.createReadStream('./src/data/users.json');
const usersWritableStream = fs.createWriteStream('./src/data/users.csv');
const fields = ['postId', 'name', 'body'];

const json2csv = new Json2csv(fields);

pipeline(
  usersReadableStream,
  json2csv,
  usersWritableStream,
  (err) => {
    err ? console.log('Pipeline failed.', err) : console.log('Pipeline succeeded.');
  }
)
