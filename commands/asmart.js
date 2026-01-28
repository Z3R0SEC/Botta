const axios = require('axios');
const { sendButton, sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'rasj',
  description: 'Chat with !Me',
  usage: 'raaj <message>',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user, attachment = null) {
    const prompt = args.join(' ').trim();
    const id = senderId;
    const token = pageAccessToken;

    const defaultMessages = [
      "Yo, Sup?",
      "Yo, What's the Word?",
      "Need Something?",
      "Listening...",
      "What's New Dude?"
    ];
    const fallback = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

    let is_doc = "text";
    let file_url = null;

    // Detect attachment type from Facebook
    if (attachment) {
      file_url = attachment.payload.url;

      if (attachment.type === "image") is_doc = "img";
      else if (attachment.type === "audio") is_doc = "aud";
      else if (attachment.type === "video") is_doc = "vid";
    }

    if (!prompt && !file_url) {
      return sendMessage(id, { text: fallback }, token);
    }

    const apiUrl = "https://mota-dev.x10.mx/api/ai";

    try {
      const response = await axios.post(apiUrl, {
        user: id,
        is_doc: is_doc,
        prompt: prompt || null,
        file_url: file_url
      }, {
        headers: {
          'Content-Type': 'application/json',
          'user-agent': 'standby-client/1.0 (device=Standby; type=bot; platform=android)',
          'authorization': 'Bearer sk-standby6TzHc9eP3LmFQn7XxWqTgZyLPa0MvdwUjdGq29eFQKmR9R'
        }
      });

      const res = response.data;

      if (res.status === "success") {
        await sendMessage(id, { text: res.data.response }, token);
      } else {
        await sendMessage(id, { text: "Our system is currently encountering an error. Our team is actively working on a fix — I should function back soon!" }, token);
      }

    } catch (error) {
      console.error('Standby AI error:', error.message || error);
      await sendMessage(id, {
        text: `Our system is currently encountering an error. Our team is actively working on a fix — Chat Soon!\n\n» System Reason: ${error.message || error}\n[xaiMothaDevelopersTraceBack!]`
      }, token);
    }
  }
};
