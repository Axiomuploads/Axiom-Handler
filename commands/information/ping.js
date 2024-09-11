const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'ping',
    description: 'Displays the bot\'s latency, API latency, host latency, and more.',
    async execute(message) {
        // Measure the time before sending the message to calculate the round-trip latency
        const msg = await message.channel.send('Pinging...');

        // Latency and API Ping
        const apiLatency = message.client.ws.ping;
        const roundTripLatency = msg.createdTimestamp - message.createdTimestamp;

        // Host latency (system uptime, CPU load, etc.)
        const hostUptime = os.uptime(); // Host system uptime in seconds
        const loadAverage = os.loadavg()[0]; // Average CPU load in the last minute
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Memory usage in MB

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Pong! 🏓')
            .addFields(
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Round-Trip Latency', value: `${roundTripLatency}ms`, inline: true },
                { name: 'Host Uptime', value: `${(hostUptime / 3600).toFixed(2)} hours`, inline: true },
                { name: 'CPU Load (1m)', value: `${loadAverage.toFixed(2)}`, inline: true },
                { name: 'Memory Usage', value: `${memoryUsage} MB`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Update the initial message with the embed
        msg.edit({ content: null, embeds: [embed] });
    }
};