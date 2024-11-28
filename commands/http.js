const { sendMessage } = require('../handles/sendMessage');      const axios = require('axios');
                                                                module.exports = {
   name: 'http',                                                   description: 'Fetch HTTP headers of a website',
   usage: 'http <url>',                                            author: 'Mota - Dev',

   async execute(senderId, args, token) {
      const url = args[0];                                            if (!url) {
         return sendMessage(senderId, { text: "Please provide a URL to fetch HTTP headers." }, token);
      }

      const apiUrl = `https://api.hackertarget.com/httpheaders/?q=${url}`;
      try {
         const response = await axios.get(apiUrl);
         const headers = response.data || "Failed to retrieve HTTP headers.";
         return sendMessage(senderId, { text: `HTTP Headers for ${url}:\n${headers}` }, token);
      } catch (error) {
         console.error("Error fetching HTTP headers:", error);
         return sendMessage(senderId, { text: "Failed to fetch HTTP headers. Try again later." }, token);
      }
   }
};
