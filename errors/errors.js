/* eslint-disable max-classes-per-file */
const {
  STATUS_ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  STATUS_NOT_AUTHORIZED,
  STATUS_FORBIDDEN,
} = require('../util/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = RESOURCE_NOT_FOUND;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_NOT_AUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN;
  }
}

class UserAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_ALREADY_EXISTS;
  }
}

// eslint-disable-next-line no-unused-vars
function handleAllErrors(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
}

module.exports = {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  ForbiddenError,
  UserAlreadyExistsError,
  handleAllErrors,
};
