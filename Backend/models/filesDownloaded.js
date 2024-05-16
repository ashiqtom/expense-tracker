const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FileDownloaded = sequelize.define('fileDownloaded', {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    downloadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW // Set default value to current timestamp
    }
});

module.exports = FileDownloaded;
