/**
 * ==== wwebjs-shell ====
 * Used for quickly testing library features
 * 
 * Running `npm run shell` will start WhatsApp Web with headless=false
 * and then drop you into Node REPL with `client` in its context. 
 */

const repl = require('repl');

const { Client, LocalAuth } = require('./index');

const client = new Client({
    puppeteer: { headless: false }, 
    authStrategy: new LocalAuth()
});
const targetContactNumber = '0732499844';



client.on('message', (message) => {
    // Check if the message is from the target contact
    if (message.from === `${targetContactNumber}@c.us`) {
        handleTargetContactMessage(message);
    }
});

function handleTargetContactMessage(message) {
    // Implement logic to handle messages from the target contact
    const replyMessage = generateReply(message.body);
    client.sendMessage(message.from, replyMessage);
}

function generateReply(messageText) {
    // Implement your specific logic to generate a reply based on the received message
    if (messageText.toLowerCase() === 'hello') {
        return 'Hi there!';
    } else if (messageText.toLowerCase() === 'help') {
        return 'I am a chatbot. You can ask me questions!';
    } else {
        return 'I didn\'t understand that. Please ask me something else.';
    }
}


console.log('Initializing...');

client.initialize();

client.on('qr', () => {
    console.log('Please scan the QR code on the browser.');
});

client.on('authenticated', (session) => {
    console.log(JSON.stringify(session));
});

client.on('ready', () => {
    const shell = repl.start('wwebjs> ');
    shell.context.client = client;
    shell.on('exit', async () => {
        await client.destroy();
    });
});


