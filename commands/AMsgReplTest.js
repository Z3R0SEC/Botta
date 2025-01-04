const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Get a random meme.',
  usage: 'message',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, reply) {
    try {
      if (reply) {
         return await sendMessage(senderId, { text: `You: ${args.join(" ")}\n\nMessage_reply: ${reply}` }, pageAccessToken);
      }
      await sendMessage(senderId, { text: `You Did Not Replied To Any Msg` }, pageAccessToken);
   } catch (error) {
      await sendMessage(senderId, { text: `Please try again later. ${error}` }, pageAccessToken);
   }
  },
};
