const sequelize = require('./db')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('users',{
    id:{type:DataTypes.SMALLINT, primaryKey:true, autoIncrement:true},
    chatId:{type:DataTypes.SMALLINT, unique:true},
    win:{type:DataTypes.SMALLINT, defaultValue:0},
    fail:{type:DataTypes.SMALLINT, defaultValue:0},
})
