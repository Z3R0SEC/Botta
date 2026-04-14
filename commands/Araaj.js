const axios = require('axios');
const { sendMessage, sendButton } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Me',
  usage: 'ai ',
  author: 'Mota Dev',

  async execute(senderId, args, pageAccessToken, event) {
    const id = senderId;
    const token = pageAccessToken;
    const adminID = "26444073998578038"; // Your Admin ID
    const prompt = args.join(' ').trim();

    const defaultMessages = ["Hi 😊", "How can I help you today?", "Anything else?", "Do you need something? 🤭", "Yoh, what's new?"];
    const fallback = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

    let is_doc = "text";
    let file_url = null;

    try {
      // 1. Handle Attachments
      const attachment = event?.message?.attachments?.[0] || null;
      if (attachment) {
        if (!attachment.payload?.url) {
          return sendMessage(id, { text: "[ ERROR ] Invalid attachment." }, token);
        }
        file_url = attachment.payload.url;
        const types = { image: "img", audio: "aud", video: "vid" };
        is_doc = types[attachment.type] || "text";
      }

      if (!prompt && !file_url) {
        return sendMessage(id, { text: fallback }, token);
      }

      // 2. API Request
      const apiUrl = "https://standbyclothing.xyz/api/ai";
      const response = await axios.post(apiUrl, {
        user: id,
        is_doc,
        prompt,
        file_url
      }, { timeout: 30000 });

      const res = response.data;

      // 3. Logic Error Handling
      if (!res || res.status !== "success") {
        console.error("API Logical Error:", res);
        return sendMessage(id, { text: `[ ERROR ] -> ${res?.error?.details || "Unknown API error"}` }, token);
      }

      // 4. Success Response
      return sendMessage(id, { text: String(res?.data?.response || "No response.") }, token);

    } catch (err) {
      // 5. Catch Block - STOP sending messages to admin here to prevent loops!
      console.error("❌ BOT ERROR:", err.message);
      return sendMessage(id, { text: "⚠️ AI service is currently unavailable." }, token);
    }

    async function logError(message, context) {
      try {
        await axios.post("https://mota-dev.x10.mx/errors", {
          error: { message, context, timestamp: new Date() }
        });
      } catch (e) {
        console.error("External Logger Failed:", e.message);
      }
    }
  }
};
