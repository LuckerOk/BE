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

const validateObject = (key, value, requiredField, fn) => {
  if (Object.keys(value).length) {
    fn(value, requiredField)
  } else {
    generateEmptyObjectError(key);
  }
};

const validateField = (key, value, requiredField) => {
  if (typeof value !== requiredField) {
    generateTypeError(key);
  }
};

const validateRequiredField = (key, value, requiredField, fn) => {
  if (typeof value === 'object') {
    validateObject(key, value, requiredField, fn);
  } else {
    validateField(key, value, requiredField);
  }
}

const validateFields = (fields, schema = REQUIRED_FIELDS) => {
  Object.entries(fields).forEach(([key, value]) => {
    const requiredField = schema[key];

    if (requiredField) {
      validateRequiredField(key, value, requiredField, validateFields);
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
