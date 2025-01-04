const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');
const axios = require("axios");

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

  const msgrepl = event?.message?.reply_to?.text?.trim();
  if (!msgrepl) {
     console.log("Not A Reply Msg!");
     console.log(`[event] ${JSON.stringify(event)}\n\n[msg] ${JSON.stringify(event.message)}`);
  }

  const messageText = event?.message?.text?.trim();
  if (!messageText) return console.log('Received event without message text');

  const [commandName, ...args] = messageText.startsWith(prefix)
    ? messageText.slice(prefix.length).split(' ')
    : messageText.split(' ');


  try {
    if (commands.has(commandName.toLowerCase())) {
      await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, msgrepl);
    } else if (commands.has('ai')) {
      await commands.get('ai').execute(senderId, [messageText], pageAccessToken, msgrepl);
    } else {
      await sendMessage(senderId, { text: "Command not found, and fallback AI command is missing." }, pageAccessToken);
    }
  } catch (error) {
    console.error(`Error executing command:`, error);
    await sendMessage(senderId, { text: error.message || 'There was an error executing that command.' }, pageAccessToken);
  }
}

module.exports = { handleMessage };
