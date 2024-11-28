const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
   name: 'fuzz',
   description: 'Fuzz a URL for hidden parameters and pages',
   usage: 'fuzz <url>',
   author: 'Mota - Dev',                                        
   async execute(senderId, args, token) {
      const url = args[0];                                            if (!url) {
         return sendMessage(senderId, { text: "Please provide a URL to fuzz (e.g., https://example.com)." }, token);
      }                                                         
      const apiUrl = `https://api.hackertarget.com/pagetools/?q=${url}`;
      try {
         const response = await axios.get(apiUrl);
         const fuzzResults = response.data || "No hidden pages or parameters found.";
         return sendMessage(senderId, { text: `URL Fuzzing Results:\n${fuzzResults}` }, token);
      } catch (error) {
         console.error("Error during URL fuzzing:", error);
         return sendMessage(senderId, { text: "Failed to fuzz the URL. Please try again later." }, token);
      }
   }
};
