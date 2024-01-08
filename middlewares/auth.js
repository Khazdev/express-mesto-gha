const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const cookies = req.headers.cookie;
  let token;
  if (cookies) {
    token = cookies.replace('jwt=', '');
  }

  if (!token) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token, 'abrakadabra');
  } catch (e) {
    return next(new Error('Неверный токен авторизации'));
  }
  req.user = payload;
  return next();
};
