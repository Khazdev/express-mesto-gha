const Card = require('../models/card');
const {
  CREATED_SUCCESS,
} = require('../constants/errors');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_SUCCESS).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findOne({ _id: cardId })
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        next(new ForbiddenError('У вас нет прав на удаление этой карточки'));
      }
      return Card.deleteOne({ _id: cardId });
    }).then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь не найден'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate([{ path: 'likes', model: 'user' }])
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((updatedCard) => res.send(updatedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь не найден'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate([{ path: 'likes', model: 'user' }])
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((updatedCard) => res.send(updatedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь не найден'));
      }
      next(err);
    });
};
