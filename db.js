const Sequelize = require('sequelize');

module.exports = new Sequelize(process.env.DATABASE_URL,{ dialect: 'postgres', dialectOptions: {
    connectTimeout: 60000, // 60 секунд
},})