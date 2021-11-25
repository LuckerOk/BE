const REQUIRED_FIELDS = {
  name: {
    title: 'name',
    type: 'string',
  },
  email: {
    title: 'email',
    type: 'string',
  },
  password: {
    title: 'password',
    type: 'string',
  },
};

const REQUIRED_ENCODED_STRUCTURE = {
  payload: {
    name: {
      title: 'name',
      type: 'string',
    },
    email: {
      title: 'email',
      type: 'string',
    },
    password: {
      title: 'password',
      type: 'string',
    },
  },
  meta: {
    algorithm: {
      title: 'algorithm',
      type: 'string',
    },
  },
};

const validateField = (field) => {
  let countFields = 0;
  const keyLength = Object.keys(REQUIRED_FIELDS).length;

  Object.entries(field).forEach(([key, value]) => {
    const requiredField = REQUIRED_FIELDS[key];

    if (countFields < keyLength && requiredField) {
      if (typeof value === requiredField.type) {
        countFields += 1;

        return;
      }

      throw new Error('Type of the field should be a string');
    }

    throw new Error('Should be only such fields as name, email and password');
  });

  if (countFields !== keyLength) {
    throw new Error('Should be only such fields as name, email and password');
  }
}

const validateFields = (fields) => {
  fields.forEach((field) => {
    validateField(field);
  });
};

const validateEncodedData = (field) => {
  console.log(field)
  let countFields = 0;
  const keyLength = Object.keys(REQUIRED_ENCODED_STRUCTURE).length;

  Object.entries(field).forEach(([key, value]) => {
    const requiredField = REQUIRED_ENCODED_STRUCTURE[key];

    if (countFields < keyLength && requiredField) {
      if (requiredField.type) {
        if (typeof value === requiredField.type) {
          countFields += 1;

          return;
        }

        throw new Error('Type of the field should be a string');
      }

      validateEncodedData(requiredField);
    }

    throw new Error('Should be another structure');
  });

  if (countFields !== keyLength) {
    throw new Error('Should be another structure');
  }
}

module.exports = {
  validateFields,
  validateEncodedData,
};
