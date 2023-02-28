const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

class TableValidator {
    async checkColumnAddValidator(req, res, next) {
        const schema = Joi.object({
            tableName: Joi.string().required(),
            columnName: Joi.string().required(),
            afterColumn: Joi.string().optional(),
        });
        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };
        const { error, value } = schema.validate(req.body, options);
        if (error) {
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }

    async checkColumnDeleteValidator(req, res, next) {
        const schema = Joi.object({
            tableName: Joi.string().required(),
            columnName: Joi.string().required(),
        });
        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };
        const { error, value } = schema.validate(req.body, options);
        if (error) {
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }
}

module.exports = TableValidator;
