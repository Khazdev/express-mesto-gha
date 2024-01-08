const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateUserName,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/user');
const { validateUserId, validateUserInfo, validateAvatar } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUserInfo, updateUserName);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

module.exports = router;
