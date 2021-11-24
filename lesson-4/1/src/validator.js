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

const validateField = (field) => {
  let countFields = 0;

  Object.entries(field).forEach(([key, value]) => {
    const requiredField = REQUIRED_FIELDS[key];

    if (countFields < 4 && requiredField) {
      if (typeof value === requiredField.type) {
        countFields += 1;

        return;
      }

      throw new Error('Type of the field should be a string')
    }

    throw new Error('Should be only such fields as name, email and password')
  });

  if (countFields !== 3) {
    throw new Error('Should be only such fields as name, email and password')
  }
}

const validateFields = (fields) => {
  fields.forEach((field) => {
    validateField(field);
  });
};

module.exports = validateFields;
