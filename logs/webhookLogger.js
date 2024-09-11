const { WebhookClient } = require('discord.js');
const { webhookURL } = require('../config.json');

const webhookClient = new WebhookClient({ url: webhookURL });

module.exports.logToWebhook = (message) => {
    webhookClient.send({
        content: message,
        username: 'Bot Logs',
        avatarURL: 'https://lavadev.net/img/lvd.png'
    }).catch(console.error);
};