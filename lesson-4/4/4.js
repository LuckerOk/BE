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

const ui = new Ui(customers, { objectMode: true });
const guardian = new Guardian({ objectMode: true });
const decryptor = new Decryptor({ objectMode: true });
const manager = new AccountManager({ objectMode: true });
ui.pipe(guardian).pipe(decryptor).pipe(manager);
