const { Bank } = require('./');

jest.mock('events');

describe('Test Bank:', () => {
  test('Register new customer', () => {
    const bank = new Bank();
    const customerId = bank.register({ name: 'test' })

    expect(customerId).toBeGreaterThan(0);
  });
  test('Test duplication of customers', () => {
    const bank = new Bank();
    bank.register({ name: 'test' })
    bank.register({ name: 'test' })

    expect(bank.emit).toHaveBeenCalledWith("error", new Error(`duplicated customer for name: 'test'`));
  });
  test('Test add customer', () => {
    const bank = new Bank();
    bank.emit('add', 1, -1)

    expect(bank.emit).toHaveBeenNthCalledWith(2, 'error', new Error('amount should be grater than 0'));
  });
});
