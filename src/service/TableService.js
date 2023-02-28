const httpStatus = require('http-status');
const TableDao = require('../dao/TableDao');
const responseHandler = require('../helper/responseHandler');

class AuthService {
    constructor() {
        this.tableDao = new TableDao();
    }

    createTableColumn = async (tableDetails) => {
        await this.tableDao.createTableColumn(tableDetails);
        return responseHandler.returnSuccess(httpStatus.CREATED);
    };

    deleteColumn = async (tableDetails) => {
        await this.tableDao.deleteColumn(tableDetails);
        return responseHandler.returnSuccess(httpStatus.ACCEPTED);
    };
}

module.exports = AuthService;
