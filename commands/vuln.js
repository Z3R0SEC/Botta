const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');
                                                           module.exports = {
   name: 'scan',
   description: 'Scan a webpage for common vulnerabilities',                                                             usage: 'scan <url>',
   author: 'Mota - Dev',                                   
   async execute(senderId, args, token) {
      const url = args[0];
      if (!url) {                                                   return sendMessage(senderId, { text: "Please provide a URL to scan for vulnerabilities (e.g., https://example.com)." }, token);
      }

      const apiUrl = `https://api.hackertarget.com/vulnerabilityscanner/?q=${url}`;
      try {
         const response = await axios.get(apiUrl);
         const vulnerabilities = response.data || "No vulnerabilities found.";
         return sendMessage(senderId, { text: `Vulnerability Scan Results:\n${vulnerabilities}` }, token);
      } catch (error) {
         console.error("Error during vulnerability scanning:", error);
         return sendMessage(senderId, { text: "Failed to scan for vulnerabilities. Please try again later." }, token);
      }
   }
};
