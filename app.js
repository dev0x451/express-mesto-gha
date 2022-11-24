const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  createUser, login,
} = require('./controllers/users');
const { RESOURCE_NOT_FOUND, RESOURCE_NOT_FOUND_MESSAGE } = require('./util/constants');

const { PORT = 3000, MONGODB_URI = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MONGODB_URI, {
  autoIndex: true,
});

app.use(cookieParser());
app.use(express.json()); // instead of body parser
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => {
  res.status(RESOURCE_NOT_FOUND).send({ message: RESOURCE_NOT_FOUND_MESSAGE });
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
