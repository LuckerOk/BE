const { Readable } = require('stream');
const { validateFields } = require('./utils/validator');

class Ui extends Readable {
  #data = [];

  constructor(data = [], options = { objectMode: true }) {
    super(options);
    validateFields(data)
    this.#data = data;
  }

  _read() {
    let data = this.#data.shift();

    if (!data) {
      this.push(null);
    } else {
      this.push(data);
    }
  }
}

module.exports = Ui;
