const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

class TableValidator {
    async checkTableColumnAddValidator(req, res, next) {
        const schema = Joi.object({
            tableName: Joi.string().required(),
            columnHeading: Joi.string().required(),
            afterColumn: Joi.string().optional(),
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };
        const { error, value } = schema.validate(req.body, options);
// console.log(req, "value");
        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }
}

module.exports = TableValidator;
