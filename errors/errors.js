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

module.exports = {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  ForbiddenError,
  UserAlreadyExistsError,
};
