require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const signinRoute = require('./routes/signin');
const signoutRoute = require('./routes/signout');
const signupRoute = require('./routes/signup');
const invalidRoutes = require('./routes/invalidURLs');
const { handleAllErrors } = require('./errors/errors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000, MONGODB_URI = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect(MONGODB_URI, {
  autoIndex: true,
});

const options = {
  origin: [
    'http://sigma696.students.nomoredomains.club',
    'https://sigma696.students.nomoredomains.club',
  ],
  credentials: true,
};

app.use('*', cors(options));
app.use(limiter);
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
app.use(cookieParser());
app.use(express.json()); // instead of body parser
// ///////////////////////////////////
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// //////////////////////////////////
app.use('/signin', signinRoute);
app.use('/signup', signupRoute);
app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('/signout', signoutRoute);
app.use('*', invalidRoutes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(handleAllErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
