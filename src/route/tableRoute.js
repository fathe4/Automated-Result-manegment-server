const express = require('express');
const TableValidator = require('../validator/TableValidator');
const TableController = require('../controllers/TableController');

const router = express.Router();

const tableValidator = new TableValidator();
const tableController = new TableController();

router.post('/create-column', tableValidator.checkColumnAddValidator, tableController.createColumn);
router.post(
    '/delete-column',
    tableValidator.checkColumnDeleteValidator,
    tableController.deleteColumn,
);

module.exports = router;
