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
    const name = user.name;

    if (!args) {
      await sendMessage(id, { text: 'Please provide a search query.' }, token);
      return;
    }

    try {
      const { data } = await axios.get(`https://hiroshi-api.onrender.com/image/pinterest?search=${encodeURIComponent(args.join(" "))}`);
      const pics = data.data.slice(0, 10);

      if (pics.length == 0) {
         return await sendMessage(id, { text: "No Images Were Found Please Try Again Latter" }, token);
      }

      for (const url of pics) {
        const attachment = {
           type: 'image',
           payload: { url }
        };
        await sendMessage(id, { attachment }, token);
      }

    } catch (error) {
        return sendMessage(id, { text: error }, token);
    }
  };
};
