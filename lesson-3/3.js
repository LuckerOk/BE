const EventEmitter = require('events').EventEmitter;

const guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

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
      this.#validateLimit(contractor, withdrawal);

      contractor.balance -= withdrawal
    });
    this.on('send', (firstId, secondId, price) => {
      this.#validatePrice(price);
      this.#validateIsExistContractor(firstId);
      this.#validateIsExistContractor(secondId);

      const firstContractorIndex = this.#contractors.findIndex((contractor) => contractor.id === firstId);
      const secondContractorIndex = this.#contractors.findIndex((contractor) => contractor.id === secondId);
      const firstContractor = this.#contractors[firstContractorIndex];
      const secondContractor = this.#contractors[secondContractorIndex];

      this.#validateWithdrawal(firstContractor, price);
      this.#validateLimit(firstContractor, firstContractor.balance);

      secondContractor.balance += price;
      firstContractor.balance -= price;
    });
    this.on('changeLimit', (id, cb) => {
      const contractorIndex = this.#contractors.findIndex((contractor) => contractor.id === id);

      this.#contractors[contractorIndex].limit = cb;
    });
    this.on('error', (error) => {
      throw new Error(error)
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

  #validateLimit(contractor, price) {
    const { limit, balance } = contractor;
    const updatedBalance = contractor.balance - price;
    const isValidLimit = limit(price, balance, updatedBalance);

    if (!isValidLimit) {
      this.emit('error', new Error('Limit violated'));
    }
  }

  register(contractor) {
    this.#validateContractor(contractor);

    const id = guid();

    this.#contractors.push({
      ...contractor,
      id,
    });

    return id;
  }
}

const bank = new Bank();

const personId = bank.register({
  name: 'Oliver White',
  balance: 700,
  limit: amount => amount < 10
});

bank.emit('withdraw', personId, 5);
bank.emit('get', personId, (amount) => {
  console.log(`I have ${amount}₴`); // I have 695₴
});
// Вариант 1
// bank.emit('changeLimit', personId, (amount, currentBalance,
//                                     updatedBalance) => {
//   return amount < 100 && updatedBalance > 700;
// });
// bank.emit('withdraw', personId, 50); // Error
// Вариант 2
// bank.emit('changeLimit', personId, (amount, currentBalance,
//                                     updatedBalance) => {
//   return amount < 100 && updatedBalance > 700 && currentBalance > 800;
// });
// // Вариант 3
// bank.emit('changeLimit', personId, (amount, currentBalance) => {
//   return currentBalance > 800;
// });
// // Вариант 4
// bank.emit('changeLimit', personId, (amount, currentBalance,
//                                     updatedBalance) => {
//   return updatedBalance > 900;
// });
