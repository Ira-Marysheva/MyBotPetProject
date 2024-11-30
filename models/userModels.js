const sequelize = require('../db')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('users',{
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    chatId:{type:DataTypes.STRING, unique:true},
    win:{type:DataTypes.INTEGER, defaultValue:0},
    fail:{type:DataTypes.INTEGER, defaultValue:0},
})
