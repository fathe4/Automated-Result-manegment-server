const express = require('express');
const ResultController = require('../controllers/ResultController');

const router = express.Router();
const fileUploadMiddleware = require('../middlewares/UploadFile');

const resultController = new ResultController();

router.post('/upload-result', fileUploadMiddleware, resultController.uploadResult);

module.exports = router;
