const { pipeline } = require('stream');
const Ui = require('./src/Ui.js');
const Guardian = require('./src/Guardian.js');
const AccountManager = require('./src/AccountManager.js');

const customers = [
  {
    name: 'Pitter Black',
    email: 'pblack@email.com',
    password: 'pblack_123'
  },
  {
    name: 'Oliver White',
    email: 'owhite@email.com',
    password: 'owhite_456'
  }
];
const ui = new Ui(customers, {  objectMode: true  });
const guardian = new Guardian({  objectMode: true  });
const manager = new AccountManager({  objectMode: true  });
pipeline(
  ui,
  guardian,
  manager,
  (err) => {
    err ? console.log('Pipeline failed.', err) : console.log('Pipeline succeeded.');
  }
)
