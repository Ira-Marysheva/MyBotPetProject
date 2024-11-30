const sequelize = require('../db')
const {DataTypes} = require('sequelize')

module.exports = sequelize.define('/tasks', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    text:{type:DataTypes.STRING, allowNull:false},
    chatId:{type:DataTypes.INTEGER,allowNull:false},
    dateReminder:{type:DataTypes.DATE, allowNull:false}
})
