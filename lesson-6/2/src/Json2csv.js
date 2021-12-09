const { Transform } = require('stream');

class Json2csv extends Transform {
  #fields = [];

  constructor(fields) {
    super();

    this.#fields = fields;
  }

  #addColumns() {
    let columns = '';
    this.#fields.forEach((key) => {
      columns += columns ? `;${key}` : `${key}`;
    });

    return `${columns}\n`;
  }


  #addRows(chunk) {
    let row = '';

    chunk.forEach((item) => {
      let itemRow = '';
      this.#fields.forEach((field) => {
        const value = item[field];

        itemRow += itemRow ? `;${value}` : `${value}`;
      })

      row += row ? `\n${itemRow}` : `${itemRow}`;
    });

    return row;
  }

  _transform(chunk, encoding, done) {
    const parsedChunk = JSON.parse(chunk.toString());
    const columnsString = this.#addColumns();
    const rowsString = this.#addRows(parsedChunk);

    this.push(`${columnsString}${rowsString}`);

    done();
  }
}

module.exports = Json2csv;
