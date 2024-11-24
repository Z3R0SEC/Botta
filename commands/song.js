const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'song',
  description: 'Search for your songs.',
  usage: 'song ‹search msg›',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a song name to search.' }, pageAccessToken);
      return;
    }

    try {
      const query = encodeURIComponent(args.join(' '));
      const { data } = await axios.get(`https://hiroshi-api.onrender.com/tiktok/spotify?search=${query}`);
      const link = data[0]?.download;

      if (link) {
        const attachment = {
          type: 'audio',
          payload: { url: link, is_reusable: true },
        };
        await sendMessage(senderId, { attachment }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'Sorry, I couldn’t find your song.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching song:', error);
      await sendMessage(senderId, { text: 'An error occurred while processing your request. Please try again later.' }, pageAccessToken);
    }
  },
};
