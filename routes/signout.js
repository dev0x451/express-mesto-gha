const router = require('express').Router();
const { logout } = require('../controllers/users');

router.post('/', logout);

module.exports = router;
