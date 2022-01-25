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

const REQUIRED_META = {
  format: {
    type: 'string',
    values: ['csv']
  },
  archive: {
    type: 'boolean',
  },
};

const generateTypeError = (value) => {
  throw new Error(`The field ${value} is of invalid type`);
}

const generateEmptyObjectError = (value) => {
  throw new Error(`The field ${value} contains an empty object`);
}

const generateInvalidError = (value) => {
  throw new Error(`The field ${value} is invalid`);
}

const validateFields = (fields, schema = REQUIRED_FIELDS) => {
  Object.entries(fields).forEach(([key, value]) => {
    const requiredField = schema[key];

    if (requiredField) {
      if (typeof value === 'object') {
        if (Object.keys(value).length) {
          validateFields(value, requiredField)
        } else {
          generateEmptyObjectError(key);
        }
      } else {
        if (typeof value !== requiredField) {
          generateTypeError(key)
        }
      }
    } else {
      generateInvalidError(key);
    }
  });
};

const validateMeta = (fields) => {
  Object.entries(fields).forEach(([key, value]) => {
    const requiredField = REQUIRED_META[key];

    if (typeof value !== requiredField.type) {
      generateTypeError(key);
    }
    if (requiredField.values && !requiredField.values.includes(value)) {
      generateInvalidError(key);
    }
  })
}

module.exports = {
  validateFields,
  validateMeta,
};
