const { BAD_REQUEST_ERROR } = require('../constants/errors');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR;
  }
}
module.exports = BadRequestError;
