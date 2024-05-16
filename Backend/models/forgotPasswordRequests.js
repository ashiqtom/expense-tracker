const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      isActive: Sequelize.BOOLEAN
    
})

module.exports = ForgotPasswordRequests;