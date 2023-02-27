const SuperDao = require('./SuperDao');
const models = require('../models');

const Table = models.table;

class TableDao extends SuperDao {
    constructor() {
        super(Table);
    }

    async createTableColumn(tableDetails) {
        return Table.addColumn(tableDetails);
    }
}

module.exports = TableDao;
