const router = require('express').Router();
const { postUser, getUsers, getUsersById } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUsersById);
router.post('/users', postUser);

module.exports = router;
