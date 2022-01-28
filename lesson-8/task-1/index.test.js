const { validateFields, validate } = require('./');

describe('Test validateFields function:', () => {
  test('Data contains not allowed field — payload.name1', () => {
    const data = {
      payload: {
        name1: 'test'
      }
    };
    const name = 'Error';
    expect(() => validateFields({ data, name })).toThrow(`${name}: data contains not allowed field — name1`);
  });
  test('Data contains not allowed field — payload1', () => {
    const data = {
      payload1: {}
    };
    const name = 'Error';
    expect(() => validateFields({ data, name })).toThrow(`${name}: data contains not allowed field — payload1`);
  });
});

describe('Test validate function:', () => {
  test('Payload should be an object', () => {
    const data = {
      payload: 'test',
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload should be an object`);
  });
  test('Payload should have required field name', () => {
    const data = {
      payload: {},
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload should have required field name`);
  });
  test('Payload.name should not be empty', () => {
    const data = {
      payload: {
        name: '',
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload.name should not be empty`);
  });
  test('Payload.name should should be a string', () => {
    const data = {
      payload: {
        name: true,
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload.name should should be a string`);
  });
  test('Payload should have required field email', () => {
    const data = {
      payload: {
        name: 'test',
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload should have required field email`);
  });
  test('Payload.email should not be empty', () => {
    const data = {
      payload: {
        name: 'test',
        email: '',
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload.email should not be empty`);
  });
  test('Payload.email should should be a string', () => {
    const data = {
      payload: {
        name: 'test',
        email: true,
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload.email should should be a string`);
  });
  test('Payload should have required field password', () => {
    const data = {
      payload: {
        name: 'test',
        email: 'test',
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload should have required field password`);
  });
  test('Payload.password should not be empty', () => {
    const data = {
      payload: {
        name: 'test',
        email: 'test',
        password: '',
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload.password should not be empty`);
  });
  test('Payload.password should should be a string', () => {
    const data = {
      payload: {
        name: 'test',
        email: 'test',
        password: true,
      },
    };
    const name = 'Error';
    expect(() => validate({ data, name })).toThrow(`${name}: payload.password should should be a string`);
  });
});
