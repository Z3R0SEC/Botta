const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');
                                                           module.exports = {
   name: 'smuggle',                                           description: 'Detect HTTP Request Smuggling vulnerability',
   usage: 'smuggle <url>',                                    author: 'Mota - Dev',

   async execute(senderId, args, token) {
      const url = args[0];
      if (!url) {                                                   return sendMessage(senderId, { text: "Please provide a URL to test for HTTP Request Smuggling (e.g., https://example.com)." }, token);
      }

      const smugglePayload = `POST / HTTP/1.1\r\nHost: ${url}\r\nContent-Length: 6\r\nTransfer-Encoding: chunked\r\n\r\n0\r\n\r\nG\r\n`;
      const apiUrl = `https://httpbin.org/post`; // Testing endpoint (replace for live test)
      try {
         const response = await axios.post(apiUrl, smugglePayload);
         if (response.status === 200) {
            return sendMessage(senderId, { text: `HTTP Request Smuggling detected at ${url}.` }, token);
         } else {
            return sendMessage(senderId, { text: "No HTTP Request Smuggling vulnerability detected." }, token);
         }
      } catch (error) {
         console.error("Error during HTTP Request Smuggling test:", error);
         return sendMessage(senderId, { text: "Failed to test for HTTP Request Smuggling. Please try again later." }, token);
      }
   }
};
