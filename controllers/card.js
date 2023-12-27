const Card = require('../models/card');
const {
  INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR, BAD_REQUEST_ERROR,
} = require('../constants/errors');

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Не удалось создать карточку' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Не удалось получить карточки' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send({
        message: 'Карточка удалена',
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Не удалось удалить карточку',
      });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate([{ path: 'likes', model: 'user' }])
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(NOT_FOUND_ERROR).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Не удалось обновить карточку',
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate([{ path: 'likes', model: 'user' }])
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Не удалось обновить карточку' });
    });
};
