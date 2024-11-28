const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'xxx',
  description: 'Fetch and send video links from the API.',
  async execute(senderId, args, pageAccessToken) {
    if (!args.length) {
      return await sendMessage(
        senderId,
        { text: 'Please provide a search term. Example: -xxx test' },
        pageAccessToken
      );
    }

    const query = args.join(' ');
    const apiUrl = `https://api.kenliejugarap.com/xnxx-search/?title=${encodeURIComponent(query)}&page=1`;

    try {
      const response = await axios.get(apiUrl);
      const { status, response: videos } = response.data;

      if (!status || !videos.length) {
        return await sendMessage(
          senderId,
          { text: 'No results found. Try a different search term.' },
          pageAccessToken
        );
      }

      // Send the first video URL
      const video = videos[0]; // Get the first video result
      const messageContent = {
        attachment: {
          type: 'video',
          payload: {
            url: video.video,
          },
        },
      };

      await sendMessage(senderId, messageContent, pageAccessToken);
    } catch (error) {
      console.error('Error fetching video from API:', error.message || error);
      await sendMessage(
        senderId,
        { text: 'An error occurred while fetching the video. Please try again later.' },
        pageAccessToken
      );
    }
  },
};
