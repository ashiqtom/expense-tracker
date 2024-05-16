const Sequelize=require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalExpense:{
        type: Sequelize.INTEGER,
        defaultValue: 0, 
        allowNull: false,
    }
});

module.exports = User;
