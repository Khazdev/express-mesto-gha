const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUserName,
  updateUserAvatar,
} = require('../controllers/user');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUserName);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
