const Sequelize = require('sequelize');
require('dotenv').config()

const url = process.env.DATABASE_URL
module.exports = new Sequelize(url,{ dialect: 'postgres'})