const { Client, GatewayIntentBits, EmbedBuilder, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Initialize the bot client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Load commands from the commands folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Loading commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Ready event
client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

// Respond when the bot is mentioned
client.on('messageCreate', async (message) => {
    if (message.mentions.has(client.user) && !message.author.bot) {
        // Count the number of .js files in the commands folder
        const commandFileCount = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')).length;

        // Calculate API Latency and Round-Trip Latency
        const apiLatency = client.ws.ping;

        // Bot Info
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const uptime = (client.uptime / 1000 / 60).toFixed(2); // Uptime in minutes
        const serverCount = client.guilds.cache.size;
        const userCount = client.users.cache.size;

        const embed = new EmbedBuilder()
            .setTitle('Bot Information')
            .setColor('Blue')
            .setDescription(`Hey there! I'm powered by **${commandFileCount} files**.`)
            .addFields(
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Memory Usage', value: `${memoryUsage} MB`, inline: true },
                { name: 'Uptime', value: `${uptime} minutes`, inline: true },
                { name: 'Servers', value: `${serverCount}`, inline: true },
                { name: 'Total Users', value: `${userCount}`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
});

// Login the bot
client.login('YOUR_BOT_TOKEN');