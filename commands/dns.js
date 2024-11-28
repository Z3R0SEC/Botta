const { sendMessage } = require('../handles/sendMessage');      const axios = require('axios');                                 
module.exports = {
   name: 'dns',
   description: 'Get the reverse DNS (PTR record) of an IP address',
   usage: 'reversedns <ip>',                                       author: 'Mota - Dev',
                                                                   async execute(senderId, args, token) {                             const ip = args[0];                                             if (!ip) {                                                         return sendMessage(senderId, { text: "Please provide an IP address." }, token);                                              }
                                                                      const apiUrl = `https://api.hackertarget.com/reversedns/?q=${ip}`;
      try {
         const response = await axios.get(apiUrl);
         const data = response.data || "No reverse DNS records found.";
         return sendMessage(senderId, { text: `Reverse DNS for ${ip}:\n${data}` }, token);
      } catch (error) {
         console.error("Error during Reverse DNS lookup:", error);
         return sendMessage(senderId, { text: "Failed to perform Reverse DNS lookup. Try again later." }, token);
      }
   }
};
