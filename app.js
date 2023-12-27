const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { NOT_FOUND_ERROR } = require('./constants/errors');

const app = express();
const port = 3000;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '658bc8d713460e7f79d5d77a', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({
    message: 'Здесь ничего нет :)',
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
