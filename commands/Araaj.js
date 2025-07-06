const axios = require('axios');
const { sendButton, sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Standby AI',
  usage: 'ai <message>',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user) {
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

    if (!prompt) {
      return sendMessage(id, { text: fallback }, token);
    }

    const apiUrl = "https://supai.onrender.com/api/ai";

    try {
      const response = await axios.get(apiUrl, {
        params: {
          user: id,
          message: prompt
        },
        headers: {
          'user-agent': 'standby-client/1.0 (device=Standby; type=bot; platform=android)',
          'authorization': 'Barier sk-standby6TzHc9eP3LmFQn7XxWqTgZyLPa0MvdwUjdGq29eFQKmR9R'
        }
      });

      const res = response.data;

      if (res.reply && res.button) {
        console.log(res.button);
        await sendButton(id, res.reply, [
          { type: "web_url", title: res.button.title, url: res.button.url }
        ], token);
      } 
      else if (res.reply) {
        await sendMessage(id, { text: res.reply }, token);
      } 
      else {
        await sendMessage(id, { text: "Our system is currently encountering an error. Our team is actively working on a fix —  I should function back soon!" }, token);
      }
    } catch (error) {
      console.error('Standby AI error:', error.message || error);
      await sendMessage(id, { text: `Our system is currently encountering an error. Our team is actively working on a fix — Chat Soon soon!\n\n» System Reason: ${error.message || error}\n[xaiMothaDevelopersTraceBack!]` }, token);
    }
  }
};
