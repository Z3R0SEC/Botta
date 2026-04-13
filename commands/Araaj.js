const axios = require('axios');
const { sendMessage, sendButton } = require('../handles/sendMessage');

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
      "Hi 😊",
      "How can I help you today?",
      "Anything else?",
      "Do you need something? 🤭",
      "Yoh, what's new?"
    ];

    const fallback = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

    let is_doc = "text";
    let file_url = null;

    try {
      const attachment = event?.message?.attachments?.[0] || null;

      if (attachment) {
        if (!attachment.payload?.url) {
          return sendMessage(id, {
            text: "[ ERROR ] Invalid attachment. Please try a different file."
          }, token);
        }

        file_url = attachment.payload.url;

        switch (attachment.type) {
          case "image":
            is_doc = "img";
            break;
          case "audio":
            is_doc = "aud";
            break;
          case "video":
            is_doc = "vid";
            break;
          default:
            return sendMessage(id, {
              text: `Unsupported attachment type: ${attachment.type}`
            }, token);
        }
      }

      if (!prompt && !file_url) {
        return sendMessage(id, { text: fallback }, token);
      }

      const apiUrl = "https://standbyclothing.xyz/api/ai";

      const response = await axios.post(
        apiUrl,
        {
          user: id,
          is_doc,
          prompt,
          file_url
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000
        }
      );

      const res = response.data;

      if (!res || res.status !== "success") {
        await logError("AI API Error", res);

        return sendMessage(
          id,
          { text: `[ ERROR ] -> ${res?.error?.details || "Unknown error"}` },
          token
        );
      }
/*
      return sendMessage(
        id,
        { text: String(res?.data?.response || "No response from AI.") },
        token
      );
      */
      return sendButton(id, res?.data?.response, [{ type: "web_url", url: "https://standbyclothing.xyz", title: "Shop Now" }, { type: "web_url", url: "https://standbyclothing.xyz/orders", title: "Track Order" } ], token);

    } catch (err) {
      console.error("FULL BOT ERROR:", err);

      await logError(err.message || "Unknown error", {
        senderId: id,
        prompt
      });

      return sendMessage(
        id,
        { text: err.message },
        token
      );
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
        console.error("Failed to log error:", e.message);
      }
    }
  }
};
