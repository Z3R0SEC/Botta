const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
   name: 'paramscan',                                         description: 'Find exposed HTTP parameters on a target website',
   usage: 'paramscan <url>',                                  author: 'Mota - Dev',

   async execute(senderId, args, token) {
      const url = args[0];
      if (!url) {                                                   return sendMessage(senderId, { text: "Please provide a URL to detect parameters (e.g., https://example.com)." }, token);
      }

      const apiUrl = `https://api.hackertarget.com/pagetools/?q=${url}`;
      try {
         const response = await axios.get(apiUrl);
         const parameters = response.data || "No exposed parameters found.";
         return sendMessage(senderId, { text: `HTTP Parameter Detection Results:\n${parameters}` }, token);
      } catch (error) {
         console.error("Error detecting HTTP parameters:", error);
         return sendMessage(senderId, { text: "Failed to detect parameters. Please try again later." }, token);
      }
   }
};
