const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorHandler');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');

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
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', () => {
  throw new NotFoundError('Здесь ничего нет :)');
});
app.use(errors());
app.use(errorsHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
