const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

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
      if (attachment) {
        if (!attachment.payload || !attachment.payload.url) {
          return sendMessage(id, { text: "⚠️ Attachment received but URL missing." }, token);
        }

        file_url = attachment.payload.url;

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

      const apiUrl = "https://mota-dev.x10.mx/api/ai"; // YOUR NEW API

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
        return sendMessage(id, {
          text: "❌ AI API Error:\n" + JSON.stringify(res, null, 2)
        }, token);
      }

      return sendMessage(id, { text: String(res.data.response) }, token);

    } catch (err) {
      let msg = "🔥 BOT ERROR\n\n";

      if (err.code === "ENOTFOUND") {
        msg += "❌ DNS ERROR: API domain not reachable.\n" + err.hostname;
      } else if (err.response) {
        msg += "❌ API RESPONSE ERROR\nStatus: " + err.response.status +
               "\nData:\n" + JSON.stringify(err.response.data, null, 2);
      } else if (err.request) {
        msg += "❌ NO RESPONSE FROM SERVER\n" + err.message;
      } else {
        msg += "❌ INTERNAL ERROR\n" + err.message;
      }

      console.error("FULL BOT ERROR:", err);

      return sendMessage(id, { text: msg }, token);
    }
  }
};
