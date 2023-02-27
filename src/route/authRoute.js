const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const TableValidator = require('../validator/TableValidator');
const ResultController = require('../controllers/ResultController');
const TableController = require('../controllers/TableController');

const router = express.Router();
const auth = require('../middlewares/auth');
const fileUploadMiddleware = require('../middlewares/UploadFile');

const authController = new AuthController();
const userValidator = new UserValidator();
const tableValidator = new TableValidator();
const tableController = new TableController();
const resultController = new ResultController();

router.post('/register', userValidator.userCreateValidator, authController.register);
router.post('/email-exists', userValidator.checkEmailValidator, authController.checkEmail);
router.post('/login', userValidator.userLoginValidator, authController.login);
router.post('/refresh-token', authController.refreshTokens);
router.post('/logout', authController.logout);
router.put(
    '/change-password',
    auth(),
    userValidator.changePasswordValidator,
    authController.changePassword,
);

router.post('/upload-result', fileUploadMiddleware, resultController.uploadResult);
router.post(
    '/create-table',
    tableValidator.checkTableColumnAddValidator,
    tableController.createTable,
);

module.exports = router;
