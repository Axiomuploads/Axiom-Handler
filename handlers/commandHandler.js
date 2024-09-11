const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }

    client.on('messageCreate', message => {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            command.execute(message, args);
        } catch (error) {
            logToWebhook(`**COMMAND** │ Error executing command: ${error.message}`);
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    });
};