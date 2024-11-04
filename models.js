const sequelize = require('./db')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('users',{
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    chatId:{type:DataTypes.INTEGER, unique:true},
    win:{type:DataTypes.STRING, defaultValue:0},
    fail:{type:DataTypes.STRING, defaultValue:0},
})
