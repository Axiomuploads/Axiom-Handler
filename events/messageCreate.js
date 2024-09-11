module.exports = {
    name: 'messageCreate',
    execute(message) {
        console.log(`Message received: ${message.content}`);
    }
};