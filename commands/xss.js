const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');                            
module.exports = {
   name: 'xss',
   description: 'Test a URL for XSS vulnerability',           usage: 'xss <url>',
   author: 'Mota - Dev',                                   
   async execute(senderId, args, token) {
      const url = args[0];                                       if (!url) {
         return sendMessage(senderId, { text: "Please provide a URL to test for XSS vulnerability (e.g., https://example.com?q=test)." }, token);
      }

      const xssPayload = `<script>alert(1)</script>`;
      const apiUrl = `${url}${encodeURIComponent(xssPayload)}`;
      try {
         const response = await axios.get(apiUrl);
         const isVulnerable = response.data.includes("alert(1)")
            ? "Potential XSS vulnerability detected!"
            : "No XSS vulnerabilities detected.";
         return sendMessage(senderId, { text: `XSS Test Results:\n${isVulnerable}` }, token);
      } catch (error) {
         console.error("Error during XSS test:", error);
         return sendMessage(senderId, { text: "Failed to test for XSS. Please try again later." }, token);
      }
   }
};
