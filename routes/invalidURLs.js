const router = require('express').Router();
const { getInvalidURL } = require('../controllers/invalidURLs');

// router.all('/', (req, res) => {
//   res.status(401).send({ message: 'router all 404!!' });
// });

router.all('/', getInvalidURL);

module.exports = router;
