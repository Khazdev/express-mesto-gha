const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');
const {
  CREATED_SUCCESS,
} = require('../constants/errors');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const handleErrors = (err, next) => {
  if (err.code === 11000) {
    next(new ConflictError('Данный email уже зарегистрирован'));
  } else if (err.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(err);
  }
};

const findUserById = (id) => User.findById(id)
  .orFail(new NotFoundError('Пользователь не найден'));

const findCurrentUser = (userId) => User.findOne({ _id: userId })
  .orFail(new NotFoundError('Пользователь не найден'));

module.exports.createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name, about, avatar, email, password: hashedPassword,
      })
        .then((user) => {
          const { password: pass, ...userWithoutPassword } = user.toObject();
          return res.status(CREATED_SUCCESS).send(userWithoutPassword);
        })
        .catch((err) => handleErrors(err, next));
    })
    .catch((err) => next(err));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  const { userId: id } = req.params;
  findUserById(id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь не найден'));
      } else next(err);
    });
};

const updateUser = (req, res, next, updateData) => {
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => handleErrors(err, next));
};

module.exports.updateUserName = (req, res, next) => {
  const { name, about } = req.body;
  updateUser(req, res, next, { name, about });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser(req, res, next, { avatar });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(new NotAuthorizedError('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new NotAuthorizedError('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '7d' });
          return res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .send({ message: 'Авторизация прошла успешно', token });
        });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  findCurrentUser(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};
