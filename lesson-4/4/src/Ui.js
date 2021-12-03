const { Readable } = require('stream');
const { validateFields } = require('./validator');

class Ui extends Readable {
  #data = [];

  constructor(data = [], options = {}) {
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
