const SuperDao = require('./SuperDao');
const models = require('../models');

const Table = models.table;

class TableDao extends SuperDao {
    constructor() {
        super(Table);
    }

    async getColumns(tableName) {
        return Table.columns(tableName);
    }

    async createTableColumn(tableDetails) {
        return Table.addColumn(tableDetails);
    }

    async deleteColumn(tableDetails) {
        return Table.deleteColumn(tableDetails);
    }
}

module.exports = TableDao;
