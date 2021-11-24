const { EventEmitter } = require('events');

class DB extends EventEmitter {
  #logs = [];

  constructor() {
    super();

    this.on('add', this.#add);
  }

  #add(data) {
    this.#logs.push({ ...data, created: new Date() });
  }
}

module.exports = DB;
