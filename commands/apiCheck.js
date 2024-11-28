const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
   name: 'keyfinder',
   description: 'Check for exposed API keys in a target domain',   usage: 'keyfinder <url>',
   author: 'Mota - Dev',                                        
   async execute(senderId, args, token) {
      const url = args[0];                                            if (!url) {
         return sendMessage(senderId, { text: "Please provide a URL to check for exposed API keys (e.g., https://example.com)." }, token);                                                            }
                                                                      const apiUrl = `https://api.hackertarget.com/apikeysearch/?q=${url}`;
      try {
         const response = await axios.get(apiUrl);
         const results = response.data || "No exposed API keys found.";
         return sendMessage(senderId, { text: `API Key Exposure Results:\n${results}` }, token);
      } catch (error) {
         console.error("Error during API key exposure detection:", error);
         return sendMessage(senderId, { text: "Failed to detect exposed API keys. Please try again later." }, token);
      }
   }
};
