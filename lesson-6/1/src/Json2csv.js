const { Transform } = require('stream');

class Json2csv extends Transform {
  constructor() {
    super();
  }

  #addColumns(chunk) {
    let keys = Object.keys(chunk);
    let columns = '';
    keys.forEach((key) => {
      columns += columns ? `;${key}` : `${key}`;
    });

    return `${columns}\n`;
  }

  #addRows(chunk) {
    let row = '';

    chunk.forEach((item) => {
      let itemRow = '';

      Object.entries(item).forEach(([_, value]) => {
        itemRow += itemRow ? `;${value}` : `${value}`;
      });

      row += row ? `\n${itemRow}` : `${itemRow}`;
    });

    return row;
  }

  _transform(chunk, encoding, done) {
    const parsedChunk = JSON.parse(chunk.toString());
    const columnsString = this.#addColumns(parsedChunk[0]);
    const rowsString = this.#addRows(parsedChunk);

    this.push(`${columnsString}${rowsString}`);

    done();
  }
}

module.exports = Json2csv;
