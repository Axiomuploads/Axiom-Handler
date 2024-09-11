const { logToWebhook } = require('./logs/webhookLogger');

module.exports.handleError = (error, context = '') => {
    console.error(`ERROR | ${context}: ${error.message}`);
    logToWebhook(`**ERROR** | ${context}: ${error.message}`);
};