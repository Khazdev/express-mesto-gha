require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mestodb',
  jwtSecret: process.env.JWT_SECRET || 'abrakadabra',
};

module.exports = config;
