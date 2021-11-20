const EventEmitter = require('events').EventEmitter;

class Bank extends EventEmitter{
  #contractors = [];

  constructor() {
    super();

    this.on('add', (id, price) => {
      this.#validateIsExistContractor(id);
      this.#validatePrice(price);

      const contractorIndex = this.#contractors.findIndex((contractor) => contractor.id === id);

      this.#contractors[contractorIndex].balance += price;
    });
    this.on('get', (id, cb) => {
      this.#validateIsExistContractor(id);

      const contractor = this.#contractors.find((contractor) => contractor.id === id);

      cb(contractor.balance)
    });
    this.on('withdraw', (id, withdrawal) => {
      this.#validateIsExistContractor(id);

      const contractorIndex = this.#contractors.findIndex((contractor) => contractor.id === id);
      const contractor = this.#contractors[contractorIndex];

      this.#validatePrice(withdrawal);
      this.#validateWithdrawal(contractor, withdrawal);

      contractor.balance -= withdrawal
    });
    this.on('error', (error) => {
      throw Error(error)
    });

    return this;
  }

  #validateIsExistContractor(id) {
    const currentContractor = this.#contractors.find((contractor) => contractor.id === id);

    if (!currentContractor) {
      this.emit('error', new Error(`Contractor doesn't exist`));
    }
  }

  #validateContractor(contractor) {
    this.#validatePrice(contractor.balance);
    const currentContractor = this.#contractors.find((contractorItem) => contractorItem.name === contractor.name);

    if (currentContractor) {
      this.emit('error', new Error('Contractor is already exists'));
    }
  }

  #validatePrice(price) {
    if (price <= 0) {
      this.emit('error', new Error('Value should be more than 0'));
    }
  }

  #validateWithdrawal(contractor, withdrawal) {
    if (contractor.balance - withdrawal < 0) {
      this.emit('error', new Error('The balance will be negative'));
    }
  }

  register(contractor) {
    this.#validateContractor(contractor);

    const id = Date.now();

    this.#contractors.push({
      ...contractor,
      id,
    });

    return id;
  }
}

const bank = new Bank();

const personId = bank.register({
  name: 'Pitter Black',
  balance: 100
});

bank.emit('add', personId, 200);
bank.emit('get', personId, (balance) => {
  console.log(`I have ${balance}₴`); // I have 120₴
});
bank.emit('withdraw', personId, 310);
// bank.emit('get', personId, (balance) => {
//   console.log(`I have ${balance}₴`); // I have 70₴
// });
