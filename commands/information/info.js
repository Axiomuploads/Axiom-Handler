const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const os = require('os');

module.exports = {
    name: 'info',
    description: 'Get information about the bot, server, user, and more.',
    async execute(message, args) {
        const subCommand = args[0]?.toLowerCase();

        switch (subCommand) {
            case 'botinfo':
                return botInfo(message);
            case 'userinfo':
                return userInfo(message);
            case 'serverinfo':
                return serverInfo(message);
            case 'channelinfo':
                return channelInfo(message);
            case 'roleinfo':
                return roleInfo(message);
            default:
                return message.reply('Please provide a valid subcommand: `botinfo`, `userinfo`, `serverinfo`, `channelinfo`, `roleinfo`.');
        }
    }
};

// Bot Information
function botInfo(message) {
    const uptime = moment.duration(message.client.uptime).humanize();
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpuUsage = os.loadavg()[0].toFixed(2);

    const embed = new EmbedBuilder()
        .setTitle('Bot Information')
        .setColor('Blue')
        .addFields(
            { name: 'Uptime', value: uptime, inline: true },
            { name: 'Memory Usage', value: `${memoryUsage} MB`, inline: true },
            { name: 'CPU Usage', value: `${cpuUsage}%`, inline: true },
            { name: 'Guild Count', value: `${message.client.guilds.cache.size}`, inline: true },
            { name: 'User Count', value: `${message.client.users.cache.size}`, inline: true }
        )
        .setTimestamp();

    return message.channel.send({ embeds: [embed] });
}

// User Information
function userInfo(message) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Information`)
        .setColor('Green')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: 'Username', value: `${user.tag}`, inline: true },
            { name: 'ID', value: `${user.id}`, inline: true },
            { name: 'Joined Server', value: `${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}`, inline: true },
            { name: 'Account Created', value: `${moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, inline: true }
        )
        .setTimestamp();

    return message.channel.send({ embeds: [embed] });
}

// Server Information
function serverInfo(message) {
    const { guild } = message;
    const createdAt = moment(guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');

    const embed = new EmbedBuilder()
        .setTitle('Server Information')
        .setColor('Purple')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
            { name: 'Server Name', value: guild.name, inline: true },
            { name: 'Server ID', value: guild.id, inline: true },
            { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
            { name: 'Member Count', value: `${guild.memberCount}`, inline: true },
            { name: 'Created At', value: createdAt, inline: true },
            { name: 'Region', value: guild.preferredLocale, inline: true }
        )
        .setTimestamp();

    return message.channel.send({ embeds: [embed] });
}

// Channel Information
function channelInfo(message) {
    const channel = message.mentions.channels.first() || message.channel;

    const embed = new EmbedBuilder()
        .setTitle(`Channel Information: ${channel.name}`)
        .setColor('Orange')
        .addFields(
            { name: 'Channel ID', value: `${channel.id}`, inline: true },
            { name: 'Type', value: `${channel.type}`, inline: true },
            { name: 'Position', value: `${channel.position}`, inline: true },
            { name: 'Created At', value: `${moment(channel.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, inline: true }
        )
        .setTimestamp();

    return message.channel.send({ embeds: [embed] });
}

// Role Information
function roleInfo(message) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply('Please mention a valid role.');

    const embed = new EmbedBuilder()
        .setTitle(`Role Information: ${role.name}`)
        .setColor(role.color || 'Grey')
        .addFields(
            { name: 'Role ID', value: `${role.id}`, inline: true },
            { name: 'Color', value: `${role.hexColor}`, inline: true },
            { name: 'Position', value: `${role.position}`, inline: true },
            { name: 'Mentionable', value: `${role.mentionable ? 'Yes' : 'No'}`, inline: true },
            { name: 'Created At', value: `${moment(role.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, inline: true }
        )
        .setTimestamp();

    return message.channel.send({ embeds: [embed] });
}