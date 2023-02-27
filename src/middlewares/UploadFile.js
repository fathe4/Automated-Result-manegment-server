const httpStatus = require('http-status');
const multer = require('multer');
const ApiError = require('../helper/ApiError');

const uploadMiddleware = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            return cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
        },
    }),
}).single('file');

const fileUploadMiddleware = (req, res, next) => {
    return new Promise((resolve, reject) => {
        uploadMiddleware(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A multer error occurred, handle it here
                reject(new ApiError(err.message, httpStatus.BAD_REQUEST));
            } else if (err) {
                // Some other error occurred, handle it here
                reject(new ApiError('Something went wrong', httpStatus.INTERNAL_SERVER_ERROR));
            } else {
                // console.log(res, "res");
                // No errors, move on to the next middleware
                resolve();
            }
        });
    })
        .then(() => {
            return next();
        })
        .catch((err) => {
            return next(err);
        });
};

module.exports = fileUploadMiddleware;
