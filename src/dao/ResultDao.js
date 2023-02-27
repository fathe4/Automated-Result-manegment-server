const SuperDao = require('./SuperDao');
const models = require('../models');

const Result = models.result;

class ResultDao extends SuperDao {
    constructor() {
        super(Result);
    }

    async uploadBulkResult(data) {
        return Result.bulkCreate(data);
    }
}

module.exports = ResultDao;
