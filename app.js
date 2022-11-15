const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { RESOURCE_NOT_FOUND, RESOURCE_NOT_FOUND_MESSAGE } = require('./util/constants');

const { PORT = 3000, MONGODB_URI = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MONGODB_URI);

app.use((req, res, next) => {
  req.user = {
    _id: '63711f2d34e0d05323700647',
  };

  next();
});
app.use(express.json());
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => {
  res.status(RESOURCE_NOT_FOUND).send({ message: RESOURCE_NOT_FOUND_MESSAGE });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
