const Ui = require('./src/Ui.js');
const Guardian = require('./src/Guardian.js');
const Decryptor = require('./src/Decryptor.js');
const AccountManager = require('./src/AccountManager.js');

const customers = [
  {
    name: 'Pitter Black',
    email: 'pblack@email.com',
    password: 'pblack_123'
  },
];

const ui = new Ui(customers);
const guardian = new Guardian();
const decryptor = new Decryptor();
const manager = new AccountManager();
ui.pipe(guardian).pipe(decryptor).pipe(manager);
