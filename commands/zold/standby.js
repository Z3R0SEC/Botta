const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Raaj',
  usage: 'ai [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, { text: "Whadup dude" }, pageAccessToken);
    }

    try {
      const response = await axios.get('https://codetta.x10.bz/mvelo', {
        params: { prompt: prompt, uid: senderId }
      });
      const reply = response.data.reply;
      console.log(reply);
      sendMessage(senderId, { text: reply }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching resp from api', error);
      sendMessage(senderId, { text: 'Hey i had problems generating Your answer. Z3R0SEC is aware of this error and will be fixing it soon' }, pageAccessToken);
    }
  }
};
