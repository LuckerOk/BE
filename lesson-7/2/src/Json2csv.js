class Json2csv {
  #concatString(firstString, secondString, divider) {
    return firstString ? `${firstString}${divider}${secondString}` : `${secondString}`;
  }

  #addColumns(data) {
    let columns = '';

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object') {
        const newColumns = this.#addColumns(value);

        columns = this.#concatString(columns, newColumns, ';');
      } else {
        columns = this.#concatString(columns, key, ';');
      }
    });

    return columns;
  }

  #addRow(row, data) {
    let itemRow = '';

    Object.values(data).forEach((value) => {
      if (typeof value === 'object') {
        const newRows = this.#addRow(row, value);

        itemRow = this.#concatString(itemRow, newRows, ';');
      } else {
        itemRow = this.#concatString(itemRow, value, ';');
      }
    });

    return this.#concatString(row, itemRow, '\n');
  }

  #addRows(data) {
    let row = '';

    data.forEach((item) => {
      row = this.#addRow(row, item);
    });

    return row;
  }

  transform(data) {
    const columnsString = this.#addColumns(data[0]);
    const rowsString = this.#addRows(data);

    return `${columnsString}\n${rowsString}`
  }
}

module.exports = Json2csv;
