require('dotenv').config();
const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { errors } = require('celebrate');
const fs = require('fs');
const { log } = require('console');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const signinRoute = require('./routes/signin');
const signoutRoute = require('./routes/signout');
const signupRoute = require('./routes/signup');
const invalidRoutes = require('./routes/invalidURLs');
const { handleAllErrors } = require('./errors/errors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT = 4000,
  MONGODB_URI = 'mongodb://localhost:27017/mestodb',
  SSL_CRT_FILE,
  SSL_KEY_FILE,
} = process.env;

const key = fs.readFileSync(SSL_KEY_FILE);
const cert = fs.readFileSync(SSL_CRT_FILE);

const app = express();
const server = https.createServer({ key, cert }, app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect(MONGODB_URI, {
  autoIndex: true,
});

const options = {
  origin: [
    'https://mesto.schapov.dev',
    'https://localhost:3000',
  ],
  credentials: true,
};

app.use('*', cors(options));
app.use(limiter);
app.use(requestLogger);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use('/api/signin', signinRoute);
app.use('/api/signup', signupRoute);
app.use(auth);
app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/signout', signoutRoute);
app.use('*', invalidRoutes);
app.use(errorLogger);
app.use(errors());
app.use(handleAllErrors);

server.listen(PORT, () => {
  log(`App listening on HTTPS port ${PORT}`);
});
