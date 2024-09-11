const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const { logToWebhook } = require('./logs/webhookLogger');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Create a new Discord client with the necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Command Collection for commands
client.commands = new Collection();

// Load Handlers for commands and events
['commandHandler', 'eventHandler'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

// Log when the bot is ready
client.once('ready', () => {
    logToWebhook('Bot is now online and ready!');
    console.log(`${client.user.tag} is online!`);
});

// Listen for message events and respond when the bot is mentioned
client.on('messageCreate', async message => {
    if (message.mentions.has(client.user) && !message.author.bot) {
        // Count the number of .js files in the commands folder (number of files powering the bot)
        const commandsPath = path.join(__dirname, 'commands');
        const commandFileCount = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')).length;

        // Latency
        const apiLatency = client.ws.ping;
        const uptime = (client.uptime / 1000 / 60).toFixed(2); // Uptime in minutes
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Memory usage in MB

        // Host info (system stats)
        const osType = os.type(); // OS type (e.g., Linux, Windows)
        const osPlatform = os.platform(); // OS platform
        const osUptime = (os.uptime() / 3600).toFixed(2); // OS uptime in hours
        const cpuModel = os.cpus()[0].model; // CPU model
        const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2); // Total memory in MB

        // Create the embed with all the information
        const embed = new EmbedBuilder()
            .setTitle('Bot Information')
            .setColor('Blue')
            .setDescription(`Hey there! You pinged me! Here's some information about me:`)
            .addFields(
                { name: 'Number of Files Powering the Bot', value: `${commandFileCount}`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Uptime', value: `${uptime} minutes`, inline: true },
                { name: 'Memory Usage', value: `${memoryUsage} MB`, inline: true },
                { name: 'Host OS Type', value: `${osType}`, inline: true },
                { name: 'OS Platform', value: `${osPlatform}`, inline: true },
                { name: 'Host Uptime', value: `${osUptime} hours`, inline: true },
                { name: 'CPU Model', value: `${cpuModel}`, inline: true },
                { name: 'Total Memory', value: `${totalMemory} MB`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Reply with the embed
        message.reply({ embeds: [embed] });
    }
});

// Login to Discord with the token
client.login(token);

// Catch and log unhandled promise rejections
process.on('unhandledRejection', error => {
    logToWebhook(`Unhandled rejection: ${error.message}`);
    console.error('Unhandled rejection:', error);
});

// Catch and log uncaught exceptions
process.on('uncaughtException', error => {
    logToWebhook(`Uncaught exception: ${error.message}`);
    console.error('Uncaught exception:', error);
});