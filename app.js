const express = require('express');
const mongoose = require('mongoose');
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
app.use(express.json());
app.use('/user', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Неверный URL' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
