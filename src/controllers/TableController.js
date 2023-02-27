const httpStatus = require('http-status');
const CreateTableService = require('../service/CreateTableService');
const logger = require('../config/logger');

class TableController {
    constructor() {
        this.createTableService = new CreateTableService();
    }

    createTable = async (req, res) => {
        try {
            const result = await this.createTableService.createTableColumn(req.body);
            res.status(result.statusCode).send({ result });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = TableController;
