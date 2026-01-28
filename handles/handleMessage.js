const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

const commands = new Map();
const prefix = '-';

// Load command modules
fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    if (command && command.name) {
      commands.set(command.name.toLowerCase(), command);
    } else {
      console.warn(`Skipping invalid command file: ${file}`);
    }
  });

async function handleMessage(event, pageAccessToken) {
  const senderId = event?.sender?.id;
  if (!senderId) return console.error('Invalid event object');

  console.log("📩 Incoming Event:", JSON.stringify(event, null, 2));

  const messageText = event?.message?.text?.trim() || null;
  const attachments = event?.message?.attachments || null;

  let commandName = null;
  let args = [];

  if (messageText) {
    const parts = messageText.startsWith(prefix)
      ? messageText.slice(prefix.length).split(' ')
      : messageText.split(' ');

    commandName = parts[0].toLowerCase();
    args = parts.slice(1);
  }

  try {
    // If a real command was used (like -help, -ai, etc)
    if (commandName && commands.has(commandName)) {
      await commands.get(commandName).execute(senderId, args, pageAccessToken, event);
    }
    // Fallback to AI for normal messages OR attachments
    else if (commands.has('ai')) {
      await commands.get('ai').execute(senderId, messageText ? [messageText] : [], pageAccessToken, event);
    }
    else {
      await sendMessage(senderId, { text: "AI system offline." }, pageAccessToken);
    }
  } catch (error) {
    console.error(`🔥 Error executing command:`, error);
    await sendMessage(senderId, { 
      text: String(error.message || error) 
    }, pageAccessToken);
  }
}

module.exports = { handleMessage };
