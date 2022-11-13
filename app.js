const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '63711f2d34e0d05323700647',
  };

  next();
});
app.use(bodyParser.json());
app.use('/', userRoutes);
app.use('/', cardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
