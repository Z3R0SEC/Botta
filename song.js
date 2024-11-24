const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'song',
  description: 'search for your songs.',
  usage: 'song ‹search msg›',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken) {
    try {
      const { data } = await axios.get(`https://hiroshi-api.onrender.com/tiktok/spotify?search=${encodeURIComponent(args.join(' '))}`);
      const link = data[0]?.download;

      await sendMessage(senderId, link ? { attachment: { type: 'audio', payload: { url: link, is_reusable: true } } } : { text: 'Sorry, I Couldnt Find Your Somg' }, pageAccessToken);
    } catch {
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
