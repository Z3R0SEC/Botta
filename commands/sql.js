const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');
                                                           module.exports = {
   name: 'sql',
   description: 'Test a URL for SQL Injection vulnerability',
   usage: 'sql <url>',
   author: 'Mota - Dev',
                                                              async execute(senderId, args, token) {
      const url = args[0];                                       if (!url) {                                                   return sendMessage(senderId, { text: "Please provide a URL to test for SQL Injection (e.g., https://example.com?id=1)." }, token);
      }

      const apiUrl = `https://api.hackertarget.com/sqlquery/?q=${encodeURIComponent(url)}`;
      try {
         const response = await axios.get(apiUrl);
         const result = response.data || "No SQL vulnerabilities detected.";
         return sendMessage(senderId, { text: `SQL Injection Test Results:\n${result}` }, token);
      } catch (error) {
         console.error("Error during SQL Injection test:", error);
         return sendMessage(senderId, { text: "Failed to test for SQL Injection. Please try again later." }, token);
      }
   }
};
