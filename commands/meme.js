const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'meme',
  description: 'Get a random meme.',
  usage: 'meme',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken) {
    try {
      const { data } = await axios.get('https://meme-api.com/gimme');
      const attachment = {
        type: 'image',
        payload: { url: data.url },
      };
      await sendMessage(senderId, { text: `😂 ${data.title}` }, pageAccessToken);
      await sendMessage(senderId, { attachment }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, { text: 'Could not fetch a meme. Please try again later.' }, pageAccessToken);
    }
  },
};
