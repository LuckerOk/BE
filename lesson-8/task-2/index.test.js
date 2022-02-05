const { Bank } = require('./');

jest.mock('events');

describe('Test Bank:', () => {
  test('Register new customer', () => {
    const bank = new Bank();
    const customerId = bank.register({ name: 'test', balance: 0 })

    expect(customerId).toBeGreaterThan(0);
  });
  test('Test duplication of customers', () => {
    const bank = new Bank();
    const name = 'test';
    const customer  = { name: name, balance: 0 };
    bank.register(customer)
    bank.register(customer)

    expect(bank.emit).toHaveBeenCalledWith("error", new Error(`duplicated customer for name: '${name}'`));
  });
  test('Test add event', () => {
    const bank = new Bank();
    const personId = 1;
    const amount = 1;
    bank.emit('add', personId, amount)

    expect(bank.emit).toHaveBeenCalledWith('add', personId, amount);
  });
  test('Test enroll function with negative balance', () => {
    const bank = new Bank();
    const customerId = bank.register({ name: 'test', balance: 0 });
    bank._enroll(customerId, -1);

    expect(bank.emit).toHaveBeenCalledWith('error', new Error('amount should be grater than 0'));
  });
});
