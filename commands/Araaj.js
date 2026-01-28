const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Me',
  usage: 'ai <message>',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, event) {
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
      // 🔍 Detect attachment from Messenger event
      const attachment = event?.message?.attachments?.[0] || null;

      if (attachment) {
        if (!attachment.payload || !attachment.payload.url) {
          return sendMessage(id, { text: "⚠️ Attachment received but URL missing." }, token);
        }

        file_url = attachment.payload.url;
        sendMessage(id, { text: file_url }, token);
        

        if (attachment.type === "image") is_doc = "img";
        else if (attachment.type === "audio") is_doc = "aud";
        else if (attachment.type === "video") is_doc = "vid";
        else {
          return sendMessage(id, { text: "⚠️ Unsupported attachment type: " + attachment.type }, token);
        }
      }

      if (!prompt && !file_url) {
        return sendMessage(id, { text: fallback }, token);
      }

      const apiUrl = "https://mota-dev.x10.mx/api/ai";

      const response = await axios.post(apiUrl, {
        user: id,
        is_doc,
        prompt: prompt || null,
        file_url
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });

      const res = response.data;

      if (!res || res.status !== "success") {
        await logError("AI API Error", res);
        return sendMessage(id, { text: "⚠️ AI error. Logged to /logs." }, token);
      }

      return sendMessage(id, { text: String(res.data.response) }, token);

    } catch (err) {
      console.error("FULL BOT ERROR:", err);
      await logError(err.message || String(err), { senderId: id, prompt });
      return sendMessage(id, { text: String(err) }, token);
    }

    async function logError(message, context) {
      try {
        await axios.post("https://mota-dev.x10.mx/errors", {
          error: {
            message,
            context
          }
        });
      } catch (e) {
        console.error("Failed to log error to API:", e.message);
      }
    }
  }
};
