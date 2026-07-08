/**
 * middleware/validate.js
 * Runs express-validator checks and short-circuits with a 400 if any fail.
 * Usage: router.post('/path', [...rules], validate, handler)
 */

const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    return next(new ApiError(400, first.msg, errors.array()));
  }
  next();
};

module.exports = validate;
