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

      // 🔥 DEBUG LOG BEFORE REQUEST
      console.log("➡️ Sending request to API:", {
        user: id,
        is_doc,
        prompt,
        file_url
      });

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

      // 🔥 Handle API logical errors (not axios errors)
      if (!res || res.status !== "success") {
        await logError("AI API Logical Error", res);

        // 🔥 Send full API error to YOU
        await sendMessage(
          "26444073998578038",
          { text: `🚨 API LOGICAL ERROR\n\n${JSON.stringify(res, null, 2)}` },
          token
        );

        return sendMessage(
          id,
          { text: `[ ERROR ] -> ${res?.error?.details || "Unknown API error"}` },
          token
        );
      }

      return sendMessage(
        id,
        { text: String(res?.data?.response || "No response from AI.") },
        token
      );

    } catch (err) {
      console.error("❌ FULL BOT ERROR:", err);

      let errorMessage = "Unknown error";
      let statusCode = null;
      let apiResponse = null;

      if (err.response) {
        // 🔥 API responded with error (e.g. 503)
        statusCode = err.response.status;
        apiResponse = err.response.data;

        errorMessage = `API ERROR ${statusCode}\n\n${JSON.stringify(apiResponse, null, 2)}`;
      } else if (err.request) {
        // 🔥 No response (server down / timeout)
        errorMessage = "No response from API (Server might be down or timed out)";
      } else {
        // 🔥 Other errors
        errorMessage = err.message;
      }

      // 🔥 Send FULL error to YOU (PSID)
      await sendMessage(
        "26444073998578038",
        { text: `🚨 ERROR LOG\n\n${errorMessage}` },
        token
      );

      // 🔥 Log externally
      await logError(errorMessage, {
        senderId: id,
        prompt,
        statusCode,
        apiResponse
      });

      // 🔥 Clean message to user
      return sendMessage(
        id,
        { text: "⚠️ AI service is currently unavailable. Please try again later." },
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
