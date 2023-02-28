const httpStatus = require('http-status');
const TableService = require('../service/TableService');
const logger = require('../config/logger');

class TableController {
    constructor() {
        this.tableService = new TableService();
    }

    createColumn = async (req, res) => {
        try {
            const result = await this.tableService.createTableColumn(req.body);
            res.status(result.statusCode).send({ result });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteColumn = async (req, res) => {
        try {
            const result = await this.tableService.deleteColumn(req.body);
            res.status(result.statusCode).send({ result });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = TableController;
