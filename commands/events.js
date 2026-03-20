const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'event',
  description: 'Event',
  usage: 'Fetch bot Event',
  author: 'me',

  async execute(senderId, args, pageAccessToken, event) {
  await sendMessage(senderId, { text: event }, pageAccessToken);
  }
};
