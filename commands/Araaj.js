const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Mota AI',
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

    if (attachment) {

      let type = attachment.type || "file";

      return sendMessage(id, {
        text:
`Attachment Support Removed

Your message included a ${type} attachment.

The new Mota AI API no longer supports:
• Images
• Videos
• Audio
• Files

Please send text messages only.

For more information visit:
https://standbyclothing.xyz/shop`
      }, token);
    }
 if (!prompt) {
      return sendMessage(id, {
        text: fallback
      }, token);
    }

    const apiUrl = "https://api.motadev.xyz/chat";

    try {

      const response = await axios.post(
        apiUrl,
        {
          user_id: id,
          message: prompt
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'user-agent':
              'motadev-ai/2.0 (platform=messenger; type=bot)'
          },
          timeout: 30000
        }
      );

      const res = response.data;

      if (res.reply) {

        await sendMessage(id, {
          text: res.reply
        }, token);

      } else {

        await sendMessage(id, {
          text:
`Our AI system is currently experiencing issues.

Please try again shortly.`
        }, token);

      }

    } catch (error) {

      console.error(
        'Mvest AI Error:',
        error.response?.data || error.message
      );

      await sendMessage(id, {
        text:
`Mota AI is currently unavailable.

Please try again later.

System Trace:
${error.message || "Unknown Error"}

[xaiMotaDevelopersTraceBack]`
      }, token);

    }

  }
};
