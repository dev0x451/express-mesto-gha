const { NotFoundError } = require('../errors/errors');
const { RESOURCE_NOT_FOUND_MESSAGE } = require('../util/constants');

function getInvalidURL(req, res, next) {
  next(new NotFoundError(RESOURCE_NOT_FOUND_MESSAGE));
}

module.exports = { getInvalidURL };
