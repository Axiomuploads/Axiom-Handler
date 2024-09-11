const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const { logToWebhook } = require('./logs/webhookLogger');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Load Handlers
['commandHandler', 'eventHandler'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.once('ready', () => {
    logToWebhook('**Handler** | Bot is Ready!');
    console.log(`${client.user.tag} has started. `);
});

client.login(token);

// Catch unhandled errors
process.on('unhandledRejection', error => {
    logToWebhook(`**ERROR** | Unhandled rejection: ${error.message}`);
    console.error('ERROR | Unhandled rejection:', error);
});

process.on('uncaughtException', error => {
    logToWebhook(`Uncaught exception: ${error.message}`);
    console.error('Uncaught exception:', error);
});