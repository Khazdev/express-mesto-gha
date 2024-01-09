const express = require('express');
const userRoutes = require('./user');
const cardRoutes = require('./card');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
