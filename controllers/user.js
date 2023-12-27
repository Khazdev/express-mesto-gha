const User = require('../models/user');
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
} = require('../constants/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка при создании пользователя' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка при получении пользователей' }));
};

module.exports.getUser = (req, res) => {
  const { userId: id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserName = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка при обновлении пользователя' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send(updatedUser);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка при обновлении пользователя',
      });
    });
};
