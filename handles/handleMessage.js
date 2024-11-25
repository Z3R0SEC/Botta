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

  const messageText = event?.message?.text?.trim();
  if (!messageText) return console.log('Received event without message text');

  const [commandName, ...args] = messageText.startsWith(prefix)
    ? messageText.slice(prefix.length).split(' ')
    : messageText.split(' ');

  const grP = `https://graph.facebook.com/v13.0/${senderId}?fields=name&access_token=${pageAccessToken}`;
  
  let user;
  try {
    const usr = await axios.get(grP);
    user = usr.data;
  } catch (error) {
    user = { name: "Friend" };
    console.error('Error fetching user information:', error);
    // return await sendMessage(senderId, { text: "Unable to retrieve user information." }, pageAccessToken);
  }

  try {
    if (commands.has(commandName.toLowerCase())) {
      await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, user);
    } else if (commands.has('ai')) {
      await commands.get('ai').execute(senderId, [messageText], pageAccessToken, user);
    } else {
      await sendMessage(senderId, { text: "Command not found, and fallback AI command is missing." }, pageAccessToken);
    }
  } catch (error) {
    console.error(`Error executing command:`, error);
    await sendMessage(senderId, { text: error.message || 'There was an error executing that command.' }, pageAccessToken);
  }
}

module.exports = { handleMessage };
