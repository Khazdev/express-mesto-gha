const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const config = require('./config');
const rootRouter = require('./routes/index');
const authorization = require('./routes/authorization');

const app = express();

mongoose
  .connect(config.databaseUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authorization);
app.use(auth);
app.use(rootRouter);
app.use('*', () => {
  throw new NotFoundError('Здесь ничего нет :)');
});
app.use(errors());
app.use(errorsHandler);
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
