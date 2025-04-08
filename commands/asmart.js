const axios = require('axios');
const { sendButton, sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Kaidora AI',
  usage: 'ai <message>',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user) {
    const prompt = args.join(' ').trim();
    const id = senderId;
    const token = pageAccessToken;

    // Random default message list
    const defaultMessages = [
      "Yo, Sup?",
      "Yo, What's the Word?",
      "Need Something?",
      "Listening...",
      "What's New Dude?"
    ];
    const tcr = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

    if (!prompt) {
      return sendMessage(id, { text: tcr }, token);
    }

    const apiParams = {
      user: id,
      prompt: prompt
    };
    
    const apiUrl = "https://your-kaidora-api-link.com"; // <-- replace with real Kaidora URL

    try {
      const response = await axios.get(apiUrl, {
        params: apiParams,
        headers: {
          'user-agent': 'kaidora-bot',           // <-- you can change the name if you want
          'authorization': 'your-api-key-here'   // <-- replace with your real API key
        }
      });

      const res = response.data;

      if (res.reply) {
        await sendButton(id, res.reply, [
          { type: "web_url", title: "Whatsapp Dev", url: "https://wa.me/+27847611848" }
        ], token);
      } 
      else if (res.type === "photo") {
        const attachment = {
          type: 'image',
          payload: { url: res.url },
        };
        await sendMessage(id, { text: res.text }, token);
        await sendMessage(id, { attachment }, token);
      } 
      else if (res.type === "song") {
        const attachment = {
          type: 'audio',
          payload: { url: res.url, is_reusable: true },
        };
        await sendMessage(id, { text: res.text }, token);
        await sendMessage(id, { attachment }, token);
      } 
      else if (res.type === "generate") {
        const attachment = {
          type: 'image',
          payload: { url: res.url },
        };
        await sendMessage(id, { text: res.text }, token);
        await sendMessage(id, { attachment }, token);
      }
      else {
        return sendMessage(id, { text: "Kaidora returned unexpected data format." }, token);
      }
    } catch (error) {
      console.error('Error communicating with Kaidora API:', error);
      return sendMessage(id, { text: `Error: ${error.message || error}` }, token);
    }
  }
};
