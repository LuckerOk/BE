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
const ui = new Ui(customers);
const guardian = new Guardian();
const manager = new AccountManager();
ui.pipe(guardian).pipe(manager);
