const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'pin',
  description: 'Search for images.',
  usage: 'pin ‹search msg›',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user) {
    const token = pageAccessToken;
    const id = senderId;

    if (!args || args.length === 0) {
      await sendMessage(id, { text: 'Please provide a search query.' }, token);
      return;
    }

    try {
      const query = encodeURIComponent(args.join(' '));
      const { data } = await axios.get(`https://hiroshi-api.onrender.com/image/pinterest?search=${query}`);
      const pics = data?.data?.slice(0, 10) || [];

      if (pics.length === 0) {
        return await sendMessage(id, { text: 'No images were found. Please try again later.' }, token);
      }

      for (const url of pics) {
        const attachment = {
          type: 'image',
          payload: { url },
        };
        await sendMessage(id, { attachment }, token);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      await sendMessage(id, { text: 'An error occurred while fetching images. Please try again later.' }, token);
    }
  },
};
