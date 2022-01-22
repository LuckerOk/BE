const REQUIRED_FIELDS = {
  name: {
    first: 'string',
    last: 'string',
  },
  phone: 'string',
  address: {
    zip: 'string',
    city: 'string',
    country: 'string',
    street: 'string',
  },
  email: 'string',
};

const validateFields = (fields, schema = REQUIRED_FIELDS) => {
  Object.entries(fields).forEach(([key, value]) => {
    const requiredField = schema[key];

    if (requiredField) {
      if (typeof value === 'object') {
        if (Object.keys(value).length) {
          validateFields(value, requiredField)
        } else {
          throw new Error(`The field ${key} contains an empty object`);
        }
      } else {
        if (typeof value !== requiredField) {
          throw new Error(`The field ${key} is of invalid type`);
        }
      }
    } else {
      throw new Error(`The field ${key} is invalid`);
    }
  });
};

module.exports = {
  validateFields,
};
