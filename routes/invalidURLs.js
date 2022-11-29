const router = require('express').Router();
const { getInvalidURL } = require('../controllers/invalidURLs');

router.all('/', getInvalidURL);

module.exports = router;
