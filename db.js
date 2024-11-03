const Sequelize = require('sequelize');

module.exports = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    { 
        host: process.env.PGHOST,
        port:process.env.PGPORT,
        dialect: 'postgres',
    }
)