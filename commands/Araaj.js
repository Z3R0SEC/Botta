const axios = require('axios');
const { sendButton, sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Me',
  usage: 'ai <message>',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user, attachment = null) {
    const id = senderId;
    const token = pageAccessToken;
    const prompt = args.join(' ').trim();

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

    try {
      // STEP 1: Detect attachment
      if (attachment) {
        if (!attachment.payload || !attachment.payload.url) {
          return sendMessage(id, { 
            text: "⚠️ Attachment received but URL is missing.\nDebug:\n" + JSON.stringify(attachment, null, 2) 
          }, token);
        }

        file_url = attachment.payload.url;

        if (attachment.type === "image") is_doc = "img";
        else if (attachment.type === "audio") is_doc = "aud";
        else if (attachment.type === "video") is_doc = "vid";
        else {
          return sendMessage(id, { 
            text: "⚠️ Unsupported attachment type: " + attachment.type 
          }, token);
        }
      }

      if (!prompt && !file_url) {
        return sendMessage(id, { text: fallback }, token);
      }

      const apiUrl = "https://mota-dev.x10.mx/api/ai";

      // STEP 2: Call your AI API
      const response = await axios.post(apiUrl, {
        user: id,
        is_doc: is_doc,
        prompt: prompt || null,
        file_url: file_url
      }, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer sk-standby6TzHc9eP3LmFQn7XxWqTgZyLPa0MvdwUjdGq29eFQKmR9R'
        },
        timeout: 60000
      });

      const res = response.data;

      // STEP 3: Validate response
      if (!res) {
        return sendMessage(id, { text: "❌ API returned empty response." }, token);
      }

      if (res.status !== "success") {
        return sendMessage(id, { 
          text: "❌ API Error:\n" + JSON.stringify(res, null, 2) 
        }, token);
      }

      if (!res.data || !res.data.response) {
        return sendMessage(id, { 
          text: "❌ Missing AI reply field:\n" + JSON.stringify(res, null, 2) 
        }, token);
      }

      // STEP 4: Send AI reply
      return sendMessage(id, { text: res.data.response }, token);

    } catch (error) {
      let errorMsg = "🔥 Standby AI CRASHED\n\n";

      if (error.response) {
        errorMsg += "API STATUS: " + error.response.status + "\n";
        errorMsg += "API DATA:\n" + JSON.stringify(error.response.data, null, 2);
      } else if (error.request) {
        errorMsg += "NO RESPONSE FROM SERVER\n";
        errorMsg += "Request:\n" + JSON.stringify(error.request, null, 2);
      } else {
        errorMsg += "ERROR MESSAGE:\n" + error.message;
      }

      console.error("AI BOT FULL ERROR:", error);

      return sendMessage(id, { text: errorMsg }, token);
    }
  }
};
