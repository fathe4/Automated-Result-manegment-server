const httpStatus = require('http-status');
const UploadResultService = require('../service/UploadResultService');
const logger = require('../config/logger');

class ResultController {
    constructor() {
        this.uploadResultService = new UploadResultService();
    }

    uploadResult = async (req, res) => {
        try {
            const result = await this.uploadResultService.uploadResult(req.file);
            res.status(result.statusCode).send({ result });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = ResultController;
